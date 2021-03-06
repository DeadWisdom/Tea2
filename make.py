#!/usr/bin/env python

import jsbundle
jsbundle.make( 'tea',
               scan=['src', 'tests'],
               build='build/tea.js',
               min='build/tea.min.js',
               tests='build/tea.tests.js',
               docs='docs/docs.json' )

### Doc Postprocessing ###
import creole
import json, pprint, sys

try:
    docs = json.load(open('docs/docs.json'))
    docs.sort(key=lambda x: x['name'])
except:
    sys.exit(0)

root = []
stack = []
for doc in docs:
    doc['children'] = []
    doc['type'] = 'class'
    doc['important'] = False
    doc['short'] = doc['name'].split('.')[-1]
    
    if doc['sig']:
        if '!important' in doc['sig']:
            doc['sig'] = doc['sig'].replace('!important', '').strip()
            doc['important'] = True
        if '!module' in doc['sig']:
            doc['sig'] = doc['sig'].replace('!module', '').strip()
            doc['type'] = 'module'
        else:
            doc['type'] = 'function'
            
    if doc['text']:
        doc['text'] = creole.convert(doc['text'])
        
    while stack:
        last = stack[-1]
        if doc['name'].startswith(last['name'] + '.'):
            last['children'].append(doc)
            break
        else:
            stack.pop()
            
    if len(stack) == 0:
        root.append(doc)
        doc['short'] = doc['name']
        
    stack.append(doc)

def compare_docs(a, b):
    if a['important'] and not b['important']:
        return -1
    if not a['important'] and b['important']:
        return 1
    return cmp(a['short'], b['short'])

root.sort(cmp = compare_docs)

for doc in docs:
    doc['children'].sort(cmp = compare_docs)

json.dump(root, open('docs/docs.json', 'w'))
