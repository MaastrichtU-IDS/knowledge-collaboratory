
// NOT USED (yet)

export interface EntityInterface {
  id: string;
  uri: string;
  label: string;
  display_label: string;
  curie?: string;
}

class Entity implements EntityInterface {
  id: string;
  uri: string;
  label: string;
  display_label: string;
  curie?: string;

  constructor(id:string) {
    // super(id);
    this.id = id
  }
}

export const createEntity = (
    target: string,
    context: any,
    title: any = null,
  ): Entity => {

  return {
    id: 'id', uri: 'uri',
    label: 'label',
    display_label: 'display_label',
  }
}

