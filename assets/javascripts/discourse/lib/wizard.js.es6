import EmberObject from "@ember/object";

function selectKitContent(content) {
  return content.map(i => ({id: i, name: i}));
}

function generateName(id) {
  return id ? sentenceCase(id) : '';
}

function generateId(name, opts={}) {
  return name ? snakeCase(name) : '';
}

function sentenceCase(string) {
  return string.replace(/[_\-]+/g, ' ')
    .toLowerCase()
    .replace(/(^\w|\b\w)/g, (m) => m.toUpperCase());
}

function snakeCase(string) {
  return string.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('_');
}

function camelCase(string) {
  return string.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
}

const userProperties = [
  'name',
  'username',
  'email',
  'avatar',
  'date_of_birth',
  'title',
  'profile_background',
  'card_background',
  'locale',
  'location',
  'website',
  'bio_raw',
  'trust_level'
];

const wizardProperties = {
  basic: {
    id: null,
    name: null,
    background: null,
    save_submissions: true,
    multiple_submissions: null,
    after_signup: null,
    after_time: null,
    after_time_scheduled: null,
    required: null,
    prompt_completion: null,
    restart_on_revisit: null,
    theme_id: null,
    permitted: null
  },
  mapped: [
    'permitted'
  ],
  advanced: [
    'restart_on_revisit',
  ],
  required: [
    'id',
  ],
  dependent: {
    after_time: 'after_time_scheduled'
  },
  objectArrays: {
    step: {
      property: 'steps',
      required: false
    },
    action: {
      property: 'actions',
      required: false
    }
  }
};

const stepProperties = {
  basic: {
    id: null,
    title: null,
    key: null,
    banner: null,
    raw_description: null,
    required_data: null,
    required_data_message: null,
    permitted_params: null
  },
  mapped: [
    'required_data',
    'permitted_params'
  ],
  advanced: [
    'required_data',
    'permitted_params'
  ],
  required: [
    'id'
  ],
  dependent: {
  },
  objectArrays: {
    field: {
      property: 'fields',
      required: false
    }
  }
}

const fieldProperties = {
  basic: {
    id: null,
    label: null,
    image: null,
    description: null,
    required: null,
    key: null,
    type: null
  },
  types: {
    text: {
      min_length: null
    },
    textarea: {
      min_length: null
    },
    composer: {
      min_length: null
    },
    text_only: {
    },
    number: {
    },
    checkbox: {
    },
    url: {
      min_length: null
    },
    upload: {
      file_types: '.jpg,.png'
    },
    dropdown: {
      prefill: null,
      content: null
    },
    tag: {
      limit: null,
      prefill: null,
      content: null
    },
    category: {
      limit: 1,
      property: 'id',
      prefill: null,
      content: null
    },
    group: {
      prefill: null,
      content: null
    },
    user_selector: {
    },
    event: {
    },
    location: {
    }
  },
  mapped: [
    'prefill',
    'content'
  ],
  advanced: [
    'property',
    'key'
  ],
  required: [
    'id',
    'type'
  ],
  dependent: {
  },
  objectArrays: {
  }
}

const actionProperties = {
  basic: {
    id: null,
    run_after: 'wizard_completion',
    type: null
  },
  types: {
    create_topic: {
      title: null,
      post: null,
      post_builder: null,
      post_template: null,
      category: null,
      tags: null,
      custom_fields: null,
      skip_redirect: null
    },
    send_message: {
      title: null,
      post: null,
      post_builder: null,
      post_template: null,
      skip_redirect: null,
      custom_fields: null,
      required: null,
      recipient: null
    },
    open_composer: {
      title: null,
      post: null,
      post_builder: null,
      post_template: null,
      category: null,
      tags: null,
      custom_fields: null
    },
    update_profile: {
      profile_updates: null,
      custom_fields: null
    },
    add_to_group: {
      group: null
    },
    route_to: {
      url: null,
      code: null
    }
  },
  mapped: [
    'title',
    'category',
    'tags',
    'custom_fields',
    'required',
    'recipient',
    'profile_updates',
    'group'
  ],
  advanced: [
    'code',
    'custom_fields',
    'skip_redirect',
    'required'
  ],
  required: [
    'id',
    'type'
  ],
  dependent: {
  },
  objectArrays: {
  }
}

if (Discourse.SiteSettings.wizard_apis_enabled) {
  actionProperties.types.send_to_api = {
    api: null,
    api_endpoint: null,
    api_body: null
  }
}

const schema = {
  wizard: wizardProperties,
  step: stepProperties,
  field: fieldProperties,
  action: actionProperties
}

function listProperties(type, objectType = null) {
  let properties = Object.keys(schema[type].basic);
      
  if (schema[type].types && objectType) {
    properties = properties.concat(Object.keys(schema[type].types[objectType]));
  }
    
  return properties;
}

function wizardFieldList(steps = [], opts = {}) {
  let upToIndex = null;
  
  if (opts.upTo) {
    upToIndex = steps.map((s) => (s.id)).indexOf(opts.upTo);
  }
     
  return steps.reduce((result, step, index) => {
    let fields = step.fields;
  
    if (fields && fields.length > 0) {
            
      if (upToIndex === null || index < upToIndex) {
        result.push(...fields.map((field) => {
          return EmberObject.create({
            id: field.id,
            label: `${field.label} (${step.id}, ${field.id})`,
            type: field.type
          });
        }));
      }
    }
    
    return result;
  }, []);
}

export {
  selectKitContent,
  generateName,
  generateId,
  camelCase,
  snakeCase,
  schema,
  userProperties,
  listProperties,
  wizardFieldList
};