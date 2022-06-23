
export interface Entity {
  id: string;
  uri: string;
  label: string;
  display_label: string;
  curie?: string;
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

