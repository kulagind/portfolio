import { FsError } from '../shared/utils/fs-error';

export interface FileItem {
  name: string;
  items?: FileItem[] | null;
  parent: FileItem | null;
  isDir: boolean;
  realPath?: string;
}

export class FileSystem {
  public readonly root: FileItem;

  private current: FileItem;

  constructor(root: FileItem) {
    if (!root) {
      throw new Error('Root FS element is empty');
    }
    this.root = root;
    this.current = this.root;
  }

  get currentItem(): FileItem {
    return this.current;
  }

  getCurrentPath(): string {
    let path = `${this.current.name}/`;
    let item = this.current.parent;
    while (item?.parent) {
      path = `${item.name}/${path}`;
      item = item.parent;
    }
    return path;
  }

  getContentRealPath(dir?: string): string {
    const endpoint = this.getEndpoint(dir);
    if (endpoint.isDir) {
      throw new FsError('Can\'t get content from dir element');
    }
    return endpoint.realPath as string;
  }

  getList(dir?: string): FileItem[] {
    const endpoint = this.getEndpoint(dir);
    if (!endpoint.isDir) {
      throw new FsError('Can\'t get file list from non-dir element');
    }
    return endpoint.items ?? [];
  }

  changeDir(dir?: string): FileItem {
    const newDir = this.getEndpoint(dir);
    if (!newDir.isDir) {
      throw new FsError('Can\'t change directory to non-dir element');
    }
    return this.current;
  }

  getAutocompleteOptions(dir?: string): string[] {
    const endpoint = this.getEndpoint(dir, {missError: true});
    const lastDir = dir?.split('/').pop() ?? '';
    return endpoint.items?.filter(i => i.name.startsWith(lastDir)).map(i => i.name) ?? [];
  }

  private getEndpoint(dir?: string, options?: { missError: boolean }): FileItem {
    if (!dir) {
      return this.current;
    }
    let point: FileItem = dir.startsWith('/') ? this.root : this.current;
    const path = dir.split('/').filter(v => !!v);

    path.forEach(value => {
      switch (value) {
        case '.':
          break;
        case '..':
          if (!point.parent) {
            throw new FsError('Path goes out of root element');
          }
          point = point.parent;
          break;
        default:
          let next = point.items?.find(i => i.name === value);
          if (!next) {
            if (options?.missError) {
              next = point;
            } else {
              throw new FsError(`Path "${value}" doesn\'t exist`);
            }
          }
          point = next;
          break;
      }
    });

    return point;
  }
}