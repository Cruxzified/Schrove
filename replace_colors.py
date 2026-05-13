import os
import re

directories_to_search = ['app', 'components']
replacements = {
    'slate-50': 'violet-50',
    'slate-100': 'violet-100',
    'slate-200': 'violet-200',
    'slate-300': 'violet-300',
    'slate-400': 'violet-400',
    'slate-500': 'violet-500',
    'slate-600': 'violet-600',
    'slate-700': 'violet-700',
    'slate-800': 'violet-800',
    'slate-900': 'violet-900',
    'slate-950': 'violet-950',
    '#0F172A': '#2e1065',
    'rgba(15,23,42': 'rgba(46,16,101',
}

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        content = file.read()
        
    original_content = content
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Updated {filepath}")

for directory in directories_to_search:
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                filepath = os.path.join(root, file)
                replace_in_file(filepath)
