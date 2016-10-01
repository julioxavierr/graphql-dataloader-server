// @flow

type ViewerType = {
  id: ?string,
}

export default class Viewer {
  id: ?string;

  constructor(data: ViewerType) {
    this.id = data.id;
  }

  static async load(userId) {
    //Test if userId is not null, otherwise this is a anoymous session
    const id = userId
      ? userId
      : null;

    let data = {
      id,
    };

    return new Viewer(data);
  }
}
