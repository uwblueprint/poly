import dropbox
import os

dbx = dropbox.Dropbox('OAUTH_API_CREDENTIALS_HERE')
dbx.users_get_current_account()

lp = "/local/directory/path" # local directory path
r = "/folder_name" # directory in dropbox to download

def download_files(local_path, root):
	for entry in dbx.files_list_folder(root).entries:
		if entry.__class__ == dropbox.files.FolderMetadata:
			# print(entry.name, "folder", entry.path_display) # for debugging
			root = root + entry.path_display
			if not os.path.exists(local_path + entry.path_display):
				os.makedirs(local_path + entry.path_display)
			download_files(local_path, entry.path_display)
		elif entry.__class__ == dropbox.files.FileMetadata:
			# print(entry.name, "file", local_path + entry.path_display, entry.path_display) # for debugging
			dbx.files_download_to_file((local_path + entry.path_display), entry.path_display)

download_files(lp, r)
