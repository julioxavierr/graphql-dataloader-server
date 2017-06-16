// @flow

type ViewerType = {
  id: ?string,
}

export default class Viewer {
  id: ?string;

  constructor(data: ViewerType) {
    this.id = data.id;
  }
};

export const load = (userId: string): Viewer => {
  const data = {
    id: userId,
  };

  return new Viewer(data);
};

// There is no need for a DataLoader instance here.
export const getLoader = () => Viewer;
