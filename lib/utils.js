"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toValue = exports.stringifyContent = void 0;
const escape_html_1 = __importDefault(require("escape-html"));
const mdast_util_to_string_1 = __importDefault(require("mdast-util-to-string"));
const stringifyContent = (node) => node.children.map(exports.toValue).join('');
exports.stringifyContent = stringifyContent;
const toValue = (node) => {
    switch (node.type) {
        case 'text':
            return (0, escape_html_1.default)(node.value);
        case 'heading':
            return (0, exports.stringifyContent)(node);
        case 'inlineCode':
            return `<code>${(0, escape_html_1.default)(node.value)}</code>`;
        case 'emphasis':
            return `<em>${(0, exports.stringifyContent)(node)}</em>`;
        case 'strong':
            return `<strong>${(0, exports.stringifyContent)(node)}</strong>`;
        case 'delete':
            return `<del>${(0, exports.stringifyContent)(node)}</del>`;
        case 'link':
            return (0, exports.stringifyContent)(node);
        default:
            return (0, mdast_util_to_string_1.default)(node);
    }
};
exports.toValue = toValue;
//# sourceMappingURL=utils.js.map