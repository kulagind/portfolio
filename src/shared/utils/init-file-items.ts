import { FileItem } from '../../models/file-system';

export function initFileItems(): FileItem {
  const root: FileItem = {
    isDir: true,
    name: '',
    parent: null,
    items: [],
  };

  const home: FileItem = {
    isDir: true,
    name: 'home',
    parent: root,
    items: [],
  };
  root.items?.push(home);

  const user: FileItem = {
    isDir: true,
    name: 'user',
    parent: home,
    items: [],
  };
  home.items?.push(user);

  const cv: FileItem = {
    isDir: false,
    name: 'CV',
    realPath: '/files/cv',
    parent: user,
  };
  user.items?.push(cv);

  const hobbies: FileItem = {
    isDir: true,
    name: 'hobbies',
    parent: user,
  };
  user.items?.push(hobbies);

  const projects: FileItem = {
    isDir: true,
    name: 'projects',
    parent: user,
  };
  user.items?.push(projects);

  const readme: FileItem = {
    isDir: false,
    name: 'README',
    realPath: '/files/readme',
    parent: user,
  };
  user.items?.push(readme);

  return root;
}