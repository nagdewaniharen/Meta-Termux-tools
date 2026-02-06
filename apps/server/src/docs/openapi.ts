export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Search Termux API',
    version: '1.0.0',
    description:
      'RESTful API for managing pages, scripts, campaigns, publishing, and tracking in Search Termux.',
  },
  servers: [{ url: '/api' }],
  tags: [
    { name: 'Pages', description: 'Page CRUD and page-script associations' },
    { name: 'Scripts', description: 'Script CRUD and status management' },
    { name: 'Campaigns', description: 'Campaign CRUD and campaign-script associations' },
    { name: 'Publish', description: 'Page publish, preview, unpublish, and rollback' },
    { name: 'Tracking', description: 'Event tracking and analytics' },
    { name: 'Auth', description: 'Authentication and session management' },
  ],
  components: {
    schemas: {
      Page: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          slug: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', enum: ['draft', 'live'] },
          draft_html: { type: 'string', nullable: true },
          live_html: { type: 'string', nullable: true },
          version: { type: 'integer', default: 1 },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      Script: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          code: { type: 'string' },
          position: {
            type: 'string',
            enum: ['head_start', 'head_end', 'body_start', 'body_end'],
          },
          is_global: { type: 'boolean', default: false },
          status: { type: 'string', enum: ['active', 'inactive', 'archived'] },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      Campaign: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          description: { type: 'string', nullable: true },
          status: { type: 'string', enum: ['active', 'inactive', 'archived'] },
          target_pages: { type: 'array', items: { type: 'string' } },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      TrackingEvent: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          page_slug: { type: 'string' },
          campaign_id: { type: 'string', nullable: true },
          event_type: { type: 'string' },
          metadata: { type: 'object', nullable: true },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {},
          error: { type: 'string' },
          meta: {
            type: 'object',
            properties: {
              page: { type: 'integer' },
              limit: { type: 'integer' },
              total: { type: 'integer' },
            },
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', default: false },
          error: { type: 'string' },
        },
      },
    },
    parameters: {
      IdParam: {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string', format: 'uuid' },
      },
      SlugParam: {
        name: 'slug',
        in: 'path',
        required: true,
        schema: { type: 'string' },
      },
      LimitParam: {
        name: 'limit',
        in: 'query',
        required: false,
        schema: { type: 'integer', default: 20 },
      },
      OffsetParam: {
        name: 'offset',
        in: 'query',
        required: false,
        schema: { type: 'integer', default: 0 },
      },
      StatusFilterParam: {
        name: 'status',
        in: 'query',
        required: false,
        schema: { type: 'string', enum: ['active', 'inactive', 'archived'] },
      },
    },
    responses: {
      Unauthorized: {
        description: 'Authentication required',
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
        },
      },
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
        },
      },
      ValidationError: {
        description: 'Validation failed',
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
        },
      },
    },
  },
  paths: {
    // -------------------------------------------------------------------------
    // Pages
    // -------------------------------------------------------------------------
    '/pages': {
      get: {
        tags: ['Pages'],
        summary: 'List all pages',
        parameters: [
          { $ref: '#/components/parameters/LimitParam' },
          { $ref: '#/components/parameters/OffsetParam' },
        ],
        responses: {
          '200': {
            description: 'Paginated list of pages',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Page' } },
                    meta: {
                      type: 'object',
                      properties: {
                        page: { type: 'integer' },
                        limit: { type: 'integer' },
                        total: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/pages/{id}': {
      get: {
        tags: ['Pages'],
        summary: 'Get a page by ID',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          '200': {
            description: 'Page details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Page' },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Pages'],
        summary: 'Update a page',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  status: { type: 'string', enum: ['draft', 'live'] },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Updated page',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Page' },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
          '422': { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
    '/pages/{id}/scripts': {
      get: {
        tags: ['Pages'],
        summary: 'Get scripts assigned to a page',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          '200': {
            description: 'List of scripts for the page',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Script' } },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      post: {
        tags: ['Pages'],
        summary: 'Add a script to a page',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['scriptId'],
                properties: {
                  scriptId: { type: 'string', format: 'uuid' },
                  order: { type: 'integer', default: 0 },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Script added to page',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { success: { type: 'boolean' } },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
          '422': { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
    '/pages/{id}/scripts/{scriptId}': {
      delete: {
        tags: ['Pages'],
        summary: 'Remove a script from a page',
        parameters: [
          { $ref: '#/components/parameters/IdParam' },
          {
            name: 'scriptId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Script removed from page',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { success: { type: 'boolean' } },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    // -------------------------------------------------------------------------
    // Scripts
    // -------------------------------------------------------------------------
    '/scripts': {
      get: {
        tags: ['Scripts'],
        summary: 'List all scripts',
        parameters: [
          { $ref: '#/components/parameters/LimitParam' },
          { $ref: '#/components/parameters/OffsetParam' },
          { $ref: '#/components/parameters/StatusFilterParam' },
        ],
        responses: {
          '200': {
            description: 'Paginated list of scripts',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Script' } },
                    meta: {
                      type: 'object',
                      properties: {
                        page: { type: 'integer' },
                        limit: { type: 'integer' },
                        total: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Scripts'],
        summary: 'Create a new script',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'code', 'position'],
                properties: {
                  name: { type: 'string' },
                  code: { type: 'string' },
                  position: {
                    type: 'string',
                    enum: ['head_start', 'head_end', 'body_start', 'body_end'],
                  },
                  is_global: { type: 'boolean', default: false },
                  status: { type: 'string', enum: ['active', 'inactive', 'archived'], default: 'active' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Created script',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Script' },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '422': { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
    '/scripts/{id}': {
      get: {
        tags: ['Scripts'],
        summary: 'Get a script by ID',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          '200': {
            description: 'Script details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Script' },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Scripts'],
        summary: 'Update a script',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  code: { type: 'string' },
                  position: {
                    type: 'string',
                    enum: ['head_start', 'head_end', 'body_start', 'body_end'],
                  },
                  is_global: { type: 'boolean' },
                  status: { type: 'string', enum: ['active', 'inactive', 'archived'] },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Updated script',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Script' },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
          '422': { $ref: '#/components/responses/ValidationError' },
        },
      },
      delete: {
        tags: ['Scripts'],
        summary: 'Delete a script',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          '200': {
            description: 'Script deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { success: { type: 'boolean' } },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/scripts/{id}/status': {
      patch: {
        tags: ['Scripts'],
        summary: 'Update script status',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['active', 'inactive', 'archived'] },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Updated script with new status',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Script' },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
          '422': { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
    // -------------------------------------------------------------------------
    // Campaigns
    // -------------------------------------------------------------------------
    '/campaigns': {
      get: {
        tags: ['Campaigns'],
        summary: 'List all campaigns',
        parameters: [
          { $ref: '#/components/parameters/LimitParam' },
          { $ref: '#/components/parameters/OffsetParam' },
          { $ref: '#/components/parameters/StatusFilterParam' },
        ],
        responses: {
          '200': {
            description: 'Paginated list of campaigns',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Campaign' } },
                    meta: {
                      type: 'object',
                      properties: {
                        page: { type: 'integer' },
                        limit: { type: 'integer' },
                        total: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Campaigns'],
        summary: 'Create a new campaign',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string', nullable: true },
                  status: { type: 'string', enum: ['active', 'inactive', 'archived'], default: 'active' },
                  target_pages: { type: 'array', items: { type: 'string' }, default: [] },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Created campaign',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Campaign' },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '422': { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
    '/campaigns/{id}': {
      get: {
        tags: ['Campaigns'],
        summary: 'Get a campaign by ID',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          '200': {
            description: 'Campaign details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Campaign' },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Campaigns'],
        summary: 'Update a campaign',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string', nullable: true },
                  status: { type: 'string', enum: ['active', 'inactive', 'archived'] },
                  target_pages: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Updated campaign',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Campaign' },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
          '422': { $ref: '#/components/responses/ValidationError' },
        },
      },
      delete: {
        tags: ['Campaigns'],
        summary: 'Delete a campaign',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          '200': {
            description: 'Campaign deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { success: { type: 'boolean' } },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/campaigns/{id}/scripts': {
      get: {
        tags: ['Campaigns'],
        summary: 'Get scripts assigned to a campaign',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          '200': {
            description: 'List of scripts for the campaign',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Script' } },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      post: {
        tags: ['Campaigns'],
        summary: 'Add a script to a campaign',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['scriptId'],
                properties: {
                  scriptId: { type: 'string', format: 'uuid' },
                  order: { type: 'integer', default: 0 },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Script added to campaign',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { success: { type: 'boolean' } },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
          '422': { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
    '/campaigns/{id}/scripts/{scriptId}': {
      delete: {
        tags: ['Campaigns'],
        summary: 'Remove a script from a campaign',
        parameters: [
          { $ref: '#/components/parameters/IdParam' },
          {
            name: 'scriptId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Script removed from campaign',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { success: { type: 'boolean' } },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    // -------------------------------------------------------------------------
    // Publish
    // -------------------------------------------------------------------------
    '/publish/{slug}/status': {
      get: {
        tags: ['Publish'],
        summary: 'Get the publish status of a page',
        parameters: [{ $ref: '#/components/parameters/SlugParam' }],
        responses: {
          '200': {
            description: 'Publish status object',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'object' },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/publish/{slug}/preview': {
      post: {
        tags: ['Publish'],
        summary: 'Preview a page (returns rendered HTML with preview banner)',
        parameters: [{ $ref: '#/components/parameters/SlugParam' }],
        responses: {
          '200': {
            description: 'Rendered HTML with preview banner',
            content: { 'text/html': { schema: { type: 'string' } } },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/publish/{slug}/publish': {
      post: {
        tags: ['Publish'],
        summary: 'Publish a page',
        parameters: [{ $ref: '#/components/parameters/SlugParam' }],
        responses: {
          '200': {
            description: 'Page published',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'object' },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/publish/{slug}/unpublish': {
      post: {
        tags: ['Publish'],
        summary: 'Unpublish a page',
        parameters: [{ $ref: '#/components/parameters/SlugParam' }],
        responses: {
          '200': {
            description: 'Page unpublished',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'object' },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/publish/{slug}/rollback': {
      post: {
        tags: ['Publish'],
        summary: 'Roll back a page to its previous published version',
        parameters: [{ $ref: '#/components/parameters/SlugParam' }],
        responses: {
          '200': {
            description: 'Page rolled back',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'object' },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    // -------------------------------------------------------------------------
    // Tracking
    // -------------------------------------------------------------------------
    '/tracking/events': {
      post: {
        tags: ['Tracking'],
        summary: 'Track a new event',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['page_slug', 'event_type'],
                properties: {
                  page_slug: { type: 'string' },
                  campaign_id: { type: 'string', nullable: true },
                  event_type: { type: 'string' },
                  metadata: { type: 'object', nullable: true },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Event tracked',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/TrackingEvent' },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '422': { $ref: '#/components/responses/ValidationError' },
        },
      },
      get: {
        tags: ['Tracking'],
        summary: 'Get recent tracking events',
        parameters: [
          { $ref: '#/components/parameters/LimitParam' },
          { $ref: '#/components/parameters/OffsetParam' },
        ],
        responses: {
          '200': {
            description: 'Paginated list of recent events',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/TrackingEvent' } },
                    meta: {
                      type: 'object',
                      properties: {
                        page: { type: 'integer' },
                        limit: { type: 'integer' },
                        total: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/tracking/stats': {
      get: {
        tags: ['Tracking'],
        summary: 'Get tracking statistics',
        parameters: [
          {
            name: 'page_slug',
            in: 'query',
            required: false,
            schema: { type: 'string' },
          },
          {
            name: 'campaign_id',
            in: 'query',
            required: false,
            schema: { type: 'string' },
          },
          {
            name: 'period',
            in: 'query',
            required: false,
            schema: { type: 'string', enum: ['1d', '7d', '30d', '90d'] },
          },
        ],
        responses: {
          '200': {
            description: 'Tracking statistics',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'object' },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    // -------------------------------------------------------------------------
    // Auth
    // -------------------------------------------------------------------------
    '/auth/session': {
      get: {
        tags: ['Auth'],
        summary: 'Get the current authenticated user',
        responses: {
          '200': {
            description: 'Current user or null',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      nullable: true,
                      properties: {
                        user: { type: 'object', nullable: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Initiate Google OAuth login',
        responses: {
          '307': { description: 'Redirect to Google OAuth provider' },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Log out the current user',
        responses: {
          '307': { description: 'Redirect to login page' },
        },
      },
    },
  },
} as const
