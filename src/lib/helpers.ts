import { NotionObject, Options, Attributes, PageDTO } from './types';
import slugify from 'slugify';

// Seperator for good-looking HTML ;)
const SEPERATOR = '';

// HTML Tag types
const types = {
  page: 'a',
  text: 'p',
  header: 'h1',
  sub_header: 'h3',
  sub_sub_header: 'h5',
  divider: 'hr',
  break: 'br',
  numbered_list: 'ol',
  bulleted_list: 'ul',
  image: 'img',
  video: 'iframe',
  to_do: 'div',
  toggle: 'div'
};

/**
 * Method that parses a Notion-Object to HTML
 * @param {*} ObjectToParse The Notion-Object
 * @param {*} options Options for parsing
 */
function formatToHtml(
  ObjectToParse: NotionObject,
  options: Options,
  index: number
) {
  let { type, properties, format, id } = ObjectToParse;
  // Get color
  const color = format && format.block_color;
  // Replace color with custom color if passed
  const customColor =
    color &&
    options.colors &&
    ((options.colors as any)[color.split('_')[0]] || color);
  // Set content
  const content =
    properties &&
    properties.title &&
    properties.title[0][0].replace(/\[.*\]:.{1,}/, '');
  const contentInfo = properties && properties.title;
  const source = properties && properties.source;
  const tags = (content && content[0] ? content[0][0] : '').match(
    /\[.{1,}\]: .{1,}/
  );
  const attrib = tags && tags[0].replace(/(\[|\])/g, '').split(':');
  if (attrib && attrib.length == 2) {
    return {
      [attrib[0]]: attrib[1].trim()
    };
  }
  const displaySource = format && format.display_source;

  // Only set Style if passed
  const property =
    customColor && color.includes('background')
      ? `style="background-color:${customColor.split('_')[0]}"`
      : `style="color:${customColor}"`;

  // Use ternary operator to return empty string instead of undefined
  const style = color ? ` ${property}` : '';

  // Set type to break if no content is existent
  if (!content && type !== 'divider' && !source) {
    type = 'break';
  }
  // Create HTML Tags with content
  switch (types[type]) {
    case types.page: {
      if (index === 0) {
        return `<h1 ${style}>${content}</h1>`;
      }
      return null;
    }
    case types.divider: {
      return `<${types.divider}${style}/>`;
    }
    case types.break: {
      return `<${types.break} />`;
    }
    case types.numbered_list: {
      return `<li${style}>${content}</li>`;
    }
    case types.bulleted_list: {
      return `<li${style}>${content}</li>`;
    }
    case types.image: {
      const imageURL: string = `https://www.notion.so/image/${encodeURIComponent(
        source
      )}?table=block&id=${id}&width=1000&cache=v2`;
      return `<${types.image} ${style} src="${imageURL}" />`;
    }
    case types.video: {
      //builds the iframe to embed videos from notion
      const videoURL: string = displaySource;
      return `<div class="notion__video"><${types.video} ${style} src="${videoURL}" allowfullscreen></${types.video}></div>`;
    }
    case types.to_do: {
      return `<div${style} class="notion__checkboxes"><input type="checkbox">${content}</div>`;
    }
    case types.toggle: {
      console.log(contentInfo);
      return `<div${style} class="notion__toggle">${content}</div>`;
    }
    case types.text: {
      //contentInfo basically is the title attribute
      if(contentInfo){
        if(contentInfo[0][1]){
          //tagType is e.g. 'a' and tagValue the value e.g. from href
          const tagType = contentInfo[0][1][0][0];
          const tagValue = contentInfo[0][1][0][1];
          //console.log(contentInfo[0][1][0][0]);
          //build the links/anchor tags
          if(tagType === 'a'){
            return `<${types.text}${style}>${`<${tagType} href="${tagValue}" target="_blank">${content}</${tagType}>`}</${types.text}>`;
          }
          if(tagType == 'b' || tagType === 'i'){
            //build 'b' and 'i' tags
            return `<${types.text}${style}>${`<${tagType}>${content}</${tagType}>`}</${types.text}>`;
          }
        }
      }
        return `<${types[type]}${style}>${content}</${types[type]}>`;
    }
    default: {
      if (types[type])
        return `<${types[type]}${style}>${content}</${types[type]}>`;
      return null;
    }
  }
}

/**
 * Formats a List of objects to HTML
 * @param {*} ObjectList List of Notion-Objects
 * @param {*} options Options for parsing
 */
function formatList(ObjectList: Array<NotionObject>, options: Options) {
  const items = [];
  const attributes: Attributes = {};
  for (let index = 0; index < ObjectList.length; index += 1) {
    const element = ObjectList[index];
    //logging
    if (element.type === 'image') {
      //let url: string = element.format.display_source;
      //console.log(element.properties);
      //console.log(encodeURIComponent(url));
    }
    if(element.type === 'video'){
      //console.log(element.properties);
      //console.log(element.format);
    }
    if(element.type === 'to_do'){
      //console.log(element.properties);
      //console.log(element.format);
    }
    if(element.type === 'toggle'){
      //console.log(element.properties);
      //console.log(element.format);
    }
    if(element.type === 'page'){
      //console.log(element.properties);
      //console.log(element.format);
    }
    if(element.type === 'text'){
      if(element.properties){
        if(element.properties.title){
            //console.log(element.properties.title);
        }
      }
    }
    //logging
    //console.log(element.type);

    let html = formatToHtml(element, options, index);
    if (html && typeof html === 'object') {
      const keys = Object.keys(html as Attributes);
      keys.forEach(key => {
        attributes[key] = (html as Attributes)[key];
      });
    } else if (
      element &&
      element.type.includes('list') &&
      !element.type.includes('column')
    ) {
      // If it the element is the first ul or ol element
      if (
        ObjectList[index - 1] &&
        !ObjectList[index - 1].type.includes('list')
      ) {
        html = `<${types[element.type]}>${SEPERATOR}${html}`;
      }
      if (
        index + 1 >= ObjectList.length ||
        (ObjectList[index + 1] && !ObjectList[index + 1].type.includes('list'))
      ) {
        html = `${html}${SEPERATOR}</${types[element.type]}>`;
      }
    }
    if (typeof html === 'string') {
      items.push(html);
    }
  }
  const { format, properties } = ObjectList[0];
  const title =
    (properties && properties.title && properties.title[0][0]) || '';
  const cover =
    format && format.page_cover
      ? format.page_cover.includes('http')
        ? format.page_cover
        : `https://www.notion.so${format.page_cover}`
      : null;
  return {
    items,
    attributes: {
      ...attributes,
      title,
      slug: slugify(title, { lower: true }),
      cover,
      teaser: items
        .map(i =>
          i
            .replace(/\[.{1,}\]: .{1,}/g, '')
            .replace(/\<a.*\>*\<\/a\>/g, '')
            .replace(/<[^>]*>/g, '')
        )
        .filter(i => i)
        .join(' ')
        .trim()
        .substring(0, 200),
      icon: format ? format.page_icon : null
    }
  };
}

/**
 * Creates a HTML Page out of a List of Notion-Objects
 * @param {*} ObjectList List of Notion-Objects
 * @param {*} options Options for parsing
 */
function toHTMLPage(
  ObjectList: Array<NotionObject>,
  options: Options
): PageDTO {
  const { items, attributes } = formatList(ObjectList, options);
  const elementsString = items.join('');
  return {
    HTML: elementsString ? `<div>${elementsString}</div>` : '',
    Attributes: { ...attributes, id: ObjectList[0].id }
  };
}

export function handleNotionError(err: Error) {
  if (err.message.includes('block')) {
    console.error('Authentication Error: Please check your token!');
  } else {
    console.error(err);
  }
}

export function isNotionID(id: string) {
  const idRegex = new RegExp(
    /[a-z,0-9]{8}-[a-z,0-9]{4}-[a-z,0-9]{4}-[a-z,0-9]{4}-[a-z,0-9]{12}/g
  );
  return idRegex.test(id);
}

export default toHTMLPage;
