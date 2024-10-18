#!/usr/bin/env python3

import os
import json
import re

# item.path
# item.title
# item.description
# item.snippet
# item.thumbnail
output_items = []

RE_META = r'{meta:(.+)}'

for item in os.walk('public/md'):
    skip_index = False
    for file in (item[2]):
        item_path = item[0].split('/')[2:]
        item_file = os.path.splitext(file)[0]
        item_ext = os.path.splitext(file)[1]
        item_title = None
        item_description = None
        item_header = True
        item_mtime = None

        if (item_ext == '.md'):
            with open(os.path.join(item[0], file)) as f:
                lines = [line.strip() for line in f.readlines()]

            for line in map(
                lambda m: m.group(1), filter(
                    lambda m: m != None, map(
                        lambda l: re.match(RE_META, l), lines
                    )
                )
            ):
                if line == 'no-header':
                    item_header = False
                if line == 'no-index':
                    skip_index = True
                    break
                elif line.startswith('title:'):
                    item_title = ':'.join(line.split(':')[1:])
                elif line.startswith('description:'):
                    item_description = ':'.join(line.split(':')[1:])

            if skip_index: continue

            item_mtime = os.stat(os.path.join(item[0], file)).st_mtime * 1000

            output_items.append({
                'path': item_path,
                'file': item_file,
                'title': item_title,
                'description': item_description,
                'header': item_header,
                'mtime': item_mtime,
            })

categories = set(map(lambda item: item['path'][0] if len(item['path']) > 0 else '', output_items))

while len(categories) > 0:
    category = categories.pop()
    category_items = list(filter(lambda item: (
        len(item['path']) == 0 and category == ''
    ) or (
        len(item['path']) > 0 and item['path'][0] == category
    ), output_items))
    print(category, list(category_items))
    with open(os.path.join('public/md', category, 'index.json'), 'w') as f:
        print(json.dumps(category_items), file=f)

with open(os.path.join('public/md', 'index.json'), 'w') as f:
    print(json.dumps(output_items), file=f)

generated_paths = []

for item in output_items:
    # print(item)
    working_path = []
    for path in item['path']:
        working_path = [*working_path, path]
        if (not (working_path in generated_paths)):
            generated_paths.append(working_path)
            print('/'.join([*working_path, 'index.json']))
            with open('/'.join(['public', 'md', *working_path, 'index.json']), 'w') as f: 
                print(json.dumps(list(filter(
                    lambda inner_item: 
                        inner_item['path'][0:len(working_path)] == working_path, 
                    output_items
                ))), file=f)
        
    filename = '/'.join(['public', 'md', *item['path'], item['file']]) + '.md.json'
    with open(filename, 'w') as f:
        print(json.dumps(item), file=f)
