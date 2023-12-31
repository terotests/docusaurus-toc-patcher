"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("@babel/parser");
const traverse_1 = __importDefault(require("@babel/traverse"));
const stringify_object_1 = __importDefault(require("stringify-object"));
const mdast_util_to_string_1 = __importDefault(require("mdast-util-to-string"));
const unist_util_visit_1 = __importDefault(require("unist-util-visit"));
const utils_1 = require("./utils");
const localNames = {
    idx: 1,
};
const getNewLocalName = (name) => {
    const localName = `${name}${localNames.idx}`;
    localNames.idx += 1;
    return localName;
};
const parseOptions = {
    plugins: ["jsx"],
    sourceType: "module",
};
const isImport = (child) => child.type === "import";
const hasImports = (index) => index > -1;
const isExport = (child) => child.type === "export";
const removeTags = (input) => input.replace("<", "").replace("/>", "").trim();
module.exports = function plugin({ name = "toc", }) {
    const isTarget = (child) => {
        let found = false;
        const ast = (0, parser_1.parse)(child.value, parseOptions);
        (0, traverse_1.default)(ast, {
            VariableDeclarator: (path) => {
                if (path.node.id.name === name) {
                    found = true;
                }
            },
        });
        return found;
    };
    const getOrCreateExistingTargetIndex = (children) => {
        let importsIndex = -1;
        let targetIndex = -1;
        children.forEach((child, index) => {
            if (isImport(child)) {
                importsIndex = index;
            }
            else if (isExport(child) && isTarget(child)) {
                targetIndex = index;
            }
        });
        if (targetIndex === -1) {
            const target = {
                default: false,
                type: "export",
                value: `export const ${name} = [];`,
            };
            targetIndex = hasImports(importsIndex) ? importsIndex + 1 : 0;
            children.splice(targetIndex, 0, target);
        }
        return targetIndex;
    };
    return (root) => {
        const headings = [];
        const PartialComponentToHeadingsName = Object.create(null);
        (0, unist_util_visit_1.default)(root, ["heading", "jsx", "import", "export"], (child, index, parent) => {
            if (child.type === "heading") {
                const headingNode = child;
                const value = (0, mdast_util_to_string_1.default)(headingNode);
                // depth: 1 headings are titles and not included in the TOC
                if (parent !== root || !value || headingNode.depth < 2) {
                    return;
                }
                headings.push({
                    value: (0, utils_1.toValue)(headingNode),
                    id: headingNode.data.id,
                    level: headingNode.depth,
                });
            }
            if (child.type === "import") {
                const importNode = child;
                const markdownExtensionRegex = /\.(?:mdx|md).;?$/;
                const imports = importNode.value
                    .split("\n")
                    .filter((statement) => markdownExtensionRegex.test(statement));
                for (let i = 0; i < imports.length; i += 1) {
                    const localName = getNewLocalName(name);
                    const importWords = imports[i].split(" ");
                    const partialPath = importWords[importWords.length - 1];
                    const partialName = importWords[1];
                    const tocImport = `import {${name} as ${localName}} from ${partialPath}`;
                    PartialComponentToHeadingsName[partialName] = localName;
                    importNode.value = `${importNode.value}\n${tocImport}`;
                }
            }
            if (child.type === "jsx") {
                const jsxNode = child;
                const componentName = removeTags(jsxNode.value);
                const headingsName = PartialComponentToHeadingsName[componentName];
                if (headingsName) {
                    headings.push(`...${headingsName}`);
                }
            }
            if (child.type === "export") {
                const exportNode = child;
                // TODO: This will remove extra exports if they are on subsequent lines
                if (exportNode.value.includes(`export const ${name}`)) {
                    exportNode.value = "";
                }
            }
        });
        const { children } = root;
        const targetIndex = getOrCreateExistingTargetIndex(children);
        if (headings.length) {
            let headingsArray = "[";
            for (const heading of headings) {
                if (typeof heading === "string") {
                    headingsArray = `${headingsArray}\n${heading},`;
                }
                else {
                    headingsArray = `${headingsArray}\n${(0, stringify_object_1.default)(heading)},`;
                }
            }
            headingsArray += "]";
            children[targetIndex].value = `export const ${name} = ${headingsArray};`;
        }
    };
};
//# sourceMappingURL=index.js.map