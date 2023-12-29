import escapeHtml from 'escape-html'
import type {Heading, PhrasingContent} from 'mdast'
import mdastToString from 'mdast-util-to-string'
import type {Parent} from 'unist'

export const stringifyContent = (node: Parent): string => (node.children as PhrasingContent[]).map(toValue).join('')

export const toValue = (node: PhrasingContent | Heading): string => {
  switch (node.type) {
    case 'text':
      return escapeHtml(node.value)
    case 'heading':
      return stringifyContent(node)
    case 'inlineCode':
      return `<code>${escapeHtml(node.value)}</code>`
    case 'emphasis':
      return `<em>${stringifyContent(node)}</em>`
    case 'strong':
      return `<strong>${stringifyContent(node)}</strong>`
    case 'delete':
      return `<del>${stringifyContent(node)}</del>`
    case 'link':
      return stringifyContent(node)
    default:
      return mdastToString(node)
  }
}
