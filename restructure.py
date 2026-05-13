import os
import shutil

app_dir = os.path.join('app')
dashboard_dir = os.path.join(app_dir, '(dashboard)')
auth_dir = os.path.join(app_dir, '(auth)')

os.makedirs(dashboard_dir, exist_ok=True)
os.makedirs(auth_dir, exist_ok=True)

# List of dirs and files to move to (dashboard)
items_to_move = ['fleet', 'alerts', 'settings', 'routes', 'students', 'page.tsx']

for item in items_to_move:
    src = os.path.join(app_dir, item)
    dst = os.path.join(dashboard_dir, item)
    if os.path.exists(src):
        shutil.move(src, dst)
        print(f"Moved {item} to (dashboard)")
