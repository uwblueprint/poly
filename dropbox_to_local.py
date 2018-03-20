import dropbox
import os

DROPBOX = dropbox.Dropbox('OAUTH_API_CREDENTIALS_HERE')
DROPBOX.users_get_current_account()

LOCAL_DIRECTORY_PATH = "/local/directory/path" # local directory path
ROOT = "/folder_name" # directory in dropbox to download

def download_files(local_path, root):
	for entry in DROPBOX.files_list_folder(root).entries:
		if isinstance(entry, dropbox.files.FolderMetadata):
			# print(entry.name, "folder", entry.path_display) # for debugging
			root = root + entry.path_display
			if not os.path.exists(local_path + entry.path_display):
				os.makedirs(local_path + entry.path_display)
			download_files(local_path, entry.path_display)
		elif isinstance(entry, dropbox.files.FileMetadata):
			# print(entry.name, "file", local_path + entry.path_display, entry.path_display) # for debugging
			DROPBOX.files_download_to_file((local_path + entry.path_display), entry.path_display)

download_files(LOCAL_DIRECTORY_PATH, ROOT)
