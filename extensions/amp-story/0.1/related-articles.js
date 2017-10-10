/**
 * Copyright 2017 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {dev, user} from '../../../src/log';
import {parseUrl} from '../../../src/url';


const TAG = 'amp-story';


/**
 * @typedef {{
 *   title: string,
 *   url: string,
 *   domainName: string,
 *   image: (string|undefined),
 * }}
 */
export let RelatedArticleDef;


/**
 * @typedef {{
 *   heading: (string|undefined),
 *   articles: !Array<!RelatedArticleDef>,
 * }}
 */
export let RelatedArticleSetDef;


/**
 * @param {!JsonObject} articleJson
 * @return {?RelatedArticleDef}
 */
function buildArticleFromJson_(articleJson) {
  if (!articleJson['title'] || !articleJson['url']) {
    user().error(TAG,
        'Articles must contain `title` and `url` fields, skipping invalid.');
    return null;
  }

  const article = {
    title: dev().assert(articleJson['title']),
    url: dev().assert(articleJson['url']),
    domainName: parseUrl(dev().assert(articleJson['url'])).hostname,
  };

  if (articleJson['image']) {
    article.image = articleJson['image'];
  }

  return /** @type {!RelatedArticleDef} */ (article);
}


/**
 * @param {!JsonObject} articleSetsResponse
 * @return {!Array<!RelatedArticleSetDef>}
 */
export function relatedArticlesFromJson(articleSetsResponse) {
  return /** @type {!Array<!RelatedArticleSetDef>} */ (
      Object.keys(articleSetsResponse).map(headingKey => {
        const articleSet = {
          articles:
              articleSetsResponse[headingKey]
                  .map(buildArticleFromJson_)
                  .filter(a => !!a),
        };

        if (headingKey.trim().length) {
          articleSet.heading = headingKey;
        }

        return /** @type {!RelatedArticleSetDef} */ (articleSet);
      }));
}
