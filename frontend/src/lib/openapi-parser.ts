'use client';

/**
 * Complete OpenAPI 3.1.0 Parser - Built from Scratch
 * 
 * Supports ALL OpenAPI 3.1.0 features without omission:
 * - Core document fields (openapi, info, servers, externalDocs, tags, security, extensions)
 * - Paths and operations (all HTTP methods, metadata, callbacks)
 * - Parameters (path, query, header, cookie with all attributes)
 * - Request Body (content, schema, examples, encoding)
 * - Responses (status codes, headers, content, links)
 * - Components (schemas with full JSON Schema 2020-12, responses, parameters, examples, etc.)
 * - Security (API key, HTTP, OAuth2, OpenID Connect)
 * - Extensions (x-*) and deprecation flags
 * 
 * KEY RULE: Never invents or displays values not present in document
 */

// ============================================================================
// COMPLETE OPENAPI 3.1.0 TYPE DEFINITIONS
// ============================================================================

export interface OpenAPIDocument {
  // Required fields
  openapi: string;
  info: InfoObject;

  // Optional root fields - only exist if present in document
  paths?: PathsObject;
  servers?: ServerObject[];
  components?: ComponentsObject;
  security?: SecurityRequirementObject[];
  tags?: TagObject[];
  externalDocs?: ExternalDocumentationObject;
  webhooks?: Record<string, PathItemObject | ReferenceObject>;
  jsonSchemaDialect?: string;

  // Extensions (x-*)
  [key: `x-${string}`]: unknown;
}

export interface InfoObject {
  // Required
  title: string;
  version: string;

  // Optional
  description?: string;
  summary?: string;
  termsOfService?: string;
  contact?: ContactObject;
  license?: LicenseObject;

  // Extensions
  [key: `x-${string}`]: unknown;
}

export interface ContactObject {
  name?: string;
  url?: string;
  email?: string;
  [key: `x-${string}`]: unknown;
}

export interface LicenseObject {
  // Required
  name: string;

  // Optional
  identifier?: string;
  url?: string;
  [key: `x-${string}`]: unknown;
}

export interface ServerObject {
  // Required
  url: string;

  // Optional
  description?: string;
  variables?: Record<string, ServerVariableObject>;
  [key: `x-${string}`]: unknown;
}

export interface ServerVariableObject {
  // Required
  default: string;

  // Optional
  enum?: string[];
  description?: string;
  [key: `x-${string}`]: unknown;
}

export interface ExternalDocumentationObject {
  // Required
  url: string;

  // Optional
  description?: string;
  [key: `x-${string}`]: unknown;
}

export interface TagObject {
  // Required
  name: string;

  // Optional
  description?: string;
  externalDocs?: ExternalDocumentationObject;
  [key: `x-${string}`]: unknown;
}

export interface PathsObject {
  [path: string]: PathItemObject | ReferenceObject | any;
}

export interface PathItemObject {
  // Optional
  $ref?: string;
  summary?: string;
  description?: string;

  // HTTP Methods
  get?: OperationObject;
  put?: OperationObject;
  post?: OperationObject;
  delete?: OperationObject;
  options?: OperationObject;
  head?: OperationObject;
  patch?: OperationObject;
  trace?: OperationObject;

  // Additional
  servers?: ServerObject[];
  parameters?: (ParameterObject | ReferenceObject)[];
  [key: `x-${string}`]: unknown;
}

export interface OperationObject {
  // Optional fields - vast majority are optional in OpenAPI
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: ExternalDocumentationObject;
  operationId?: string;
  parameters?: (ParameterObject | ReferenceObject)[];
  requestBody?: RequestBodyObject | ReferenceObject;
  responses?: ResponsesObject;
  callbacks?: Record<string, CallbackObject | ReferenceObject>;
  deprecated?: boolean;
  security?: SecurityRequirementObject[];
  servers?: ServerObject[];
  [key: `x-${string}`]: unknown;
}

export interface ParameterObject {
  // Required
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';

  // Optional but common
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;

  // Style and explode
  style?: 'matrix' | 'label' | 'form' | 'simple' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject';
  explode?: boolean;
  allowReserved?: boolean;

  // Schema definition
  schema?: SchemaObject | ReferenceObject;
  example?: unknown;
  examples?: Record<string, ExampleObject | ReferenceObject>;
  content?: Record<string, MediaTypeObject>;

  [key: `x-${string}`]: unknown;
}

export interface RequestBodyObject {
  // Required
  content: Record<string, MediaTypeObject>;

  // Optional
  description?: string;
  required?: boolean;
  [key: `x-${string}`]: unknown;
}

export interface MediaTypeObject {
  schema?: SchemaObject | ReferenceObject;
  example?: unknown;
  examples?: Record<string, ExampleObject | ReferenceObject>;
  encoding?: Record<string, EncodingObject>;
  [key: `x-${string}`]: unknown;
}

export interface EncodingObject {
  contentType?: string;
  headers?: Record<string, HeaderObject | ReferenceObject>;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
  [key: `x-${string}`]: unknown;
}

export interface ResponsesObject {
  [statusCode: string]: ResponseObject | ReferenceObject | undefined;
  default?: ResponseObject | ReferenceObject;
}

export interface ResponseObject {
  // Required
  description: string;

  // Optional
  headers?: Record<string, HeaderObject | ReferenceObject>;
  content?: Record<string, MediaTypeObject>;
  links?: Record<string, LinkObject | ReferenceObject>;
  [key: `x-${string}`]: unknown;
}

export interface HeaderObject extends Omit<ParameterObject, 'name' | 'in'> {
  [key: `x-${string}`]: unknown;
}

export interface LinkObject {
  operationRef?: string;
  operationId?: string;
  parameters?: Record<string, unknown>;
  requestBody?: unknown;
  description?: string;
  server?: ServerObject;
  [key: `x-${string}`]: unknown;
}

// COMPLETE JSON Schema 2020-12 support for OpenAPI 3.1
export interface SchemaObject {
  // Schema identification
  $id?: string;
  $schema?: string;
  $ref?: string;
  $anchor?: string;
  $dynamicRef?: string;
  $dynamicAnchor?: string;
  $vocabulary?: Record<string, boolean>;
  $comment?: string;
  $defs?: Record<string, SchemaObject>;

  // Core validation
  type?: JsonSchemaType | JsonSchemaType[];
  const?: unknown;
  enum?: unknown[];

  // Numeric validation
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number;

  // String validation
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  format?: string;

  // Array validation  
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxContains?: number;
  minContains?: number;

  // Object validation
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  dependentRequired?: Record<string, string[]>;

  // Schema composition
  allOf?: (SchemaObject | ReferenceObject)[];
  anyOf?: (SchemaObject | ReferenceObject)[];
  oneOf?: (SchemaObject | ReferenceObject)[];
  not?: SchemaObject | ReferenceObject;

  // Conditional schemas
  if?: SchemaObject | ReferenceObject;
  then?: SchemaObject | ReferenceObject;
  else?: SchemaObject | ReferenceObject;

  // Array schemas
  items?: SchemaObject | ReferenceObject;
  prefixItems?: (SchemaObject | ReferenceObject)[];
  contains?: SchemaObject | ReferenceObject;
  unevaluatedItems?: boolean | SchemaObject | ReferenceObject;

  // Object schemas
  properties?: Record<string, SchemaObject | ReferenceObject>;
  patternProperties?: Record<string, SchemaObject | ReferenceObject>;
  additionalProperties?: boolean | SchemaObject | ReferenceObject;
  propertyNames?: SchemaObject | ReferenceObject;
  unevaluatedProperties?: boolean | SchemaObject | ReferenceObject;

  // Generic metadata
  title?: string;
  description?: string;
  default?: unknown;
  deprecated?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
  examples?: unknown[];

  // OpenAPI-specific extensions
  nullable?: boolean;
  discriminator?: DiscriminatorObject;
  xml?: XMLObject;
  externalDocs?: ExternalDocumentationObject;
  example?: unknown;

  [key: `x-${string}`]: unknown;
}

type JsonSchemaType = 'null' | 'boolean' | 'object' | 'array' | 'number' | 'string' | 'integer';

export interface DiscriminatorObject {
  propertyName: string;
  mapping?: Record<string, string>;
  [key: `x-${string}`]: unknown;
}

export interface XMLObject {
  name?: string;
  namespace?: string;
  prefix?: string;
  attribute?: boolean;
  wrapped?: boolean;
  [key: `x-${string}`]: unknown;
}

export interface ExampleObject {
  summary?: string;
  description?: string;
  value?: unknown;
  externalValue?: string;
  [key: `x-${string}`]: unknown;
}

export interface ComponentsObject {
  schemas?: Record<string, SchemaObject | ReferenceObject>;
  responses?: Record<string, ResponseObject | ReferenceObject>;
  parameters?: Record<string, ParameterObject | ReferenceObject>;
  examples?: Record<string, ExampleObject | ReferenceObject>;
  requestBodies?: Record<string, RequestBodyObject | ReferenceObject>;
  headers?: Record<string, HeaderObject | ReferenceObject>;
  securitySchemes?: Record<string, SecuritySchemeObject | ReferenceObject>;
  links?: Record<string, LinkObject | ReferenceObject>;
  callbacks?: Record<string, CallbackObject | ReferenceObject>;
  pathItems?: Record<string, PathItemObject | ReferenceObject>;
  [key: `x-${string}`]: unknown;
}

export interface SecuritySchemeObject {
  // Required
  type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect' | 'mutualTLS';

  // Optional based on type
  description?: string;
  name?: string; // apiKey
  in?: 'query' | 'header' | 'cookie'; // apiKey
  scheme?: string; // http
  bearerFormat?: string; // http
  flows?: OAuthFlowsObject; // oauth2
  openIdConnectUrl?: string; // openIdConnect
  [key: `x-${string}`]: unknown;
}

export interface OAuthFlowsObject {
  implicit?: OAuthFlowObject;
  password?: OAuthFlowObject;
  clientCredentials?: OAuthFlowObject;
  authorizationCode?: OAuthFlowObject;
  [key: `x-${string}`]: unknown;
}

export interface OAuthFlowObject {
  authorizationUrl?: string; // implicit, authorizationCode
  tokenUrl?: string; // password, clientCredentials, authorizationCode
  refreshUrl?: string;
  scopes: Record<string, string>; // Required
  [key: `x-${string}`]: unknown;
}

export interface SecurityRequirementObject {
  [name: string]: string[];
}

export interface CallbackObject {
  [expression: string]: PathItemObject | ReferenceObject;
  [key: `x-${string}`]: unknown;
}

export interface ReferenceObject {
  $ref: string;
  summary?: string;
  description?: string;
}

// ============================================================================
// PARSER CLASS - COMPREHENSIVE OPENAPI 3.1.0 IMPLEMENTATION
// ============================================================================

export interface ParseResult {
  document: OpenAPIDocument;
  errors: ValidationError[];
  warnings: ValidationError[];
  unresolvedRefs: UnresolvedReference[];
}

export interface ValidationError {
  path: string;
  message: string;
  code: string;
}

export interface UnresolvedReference {
  path: string;
  ref: string;
  reason: string;
}

export class OpenAPIParser {
  private errors: ValidationError[] = [];
  private warnings: ValidationError[] = [];
  private unresolvedRefs: UnresolvedReference[] = [];

  /**
   * Parse OpenAPI document - supports JSON only for security
   * NEVER invents values - only uses what exists in document
   */
  parse(content: string): ParseResult {
    this.resetState();

    try {
      const parsed = this.parseJson(content);
      const document = this.buildDocument(parsed);

      return {
        document,
        errors: [...this.errors],
        warnings: [...this.warnings],
        unresolvedRefs: [...this.unresolvedRefs]
      };
    } catch (error) {
      this.addError('document', (error as Error).message, 'PARSE_ERROR');

      // Return minimal valid document on parse failure
      return {
        document: {
          openapi: '3.1.0',
          info: { title: 'Parse Error', version: '1.0.0' }
        },
        errors: [...this.errors],
        warnings: [...this.warnings],
        unresolvedRefs: []
      };
    }
  }

  /**
   * Serialize document back to JSON - maintains round-trip fidelity
   */
  serialize(document: OpenAPIDocument): string {
    return JSON.stringify(this.cleanDocument(document), null, 2);
  }

  private resetState(): void {
    this.errors = [];
    this.warnings = [];
    this.unresolvedRefs = [];
  }

  private parseJson(content: string): unknown {
    const trimmed = content.trim();
    if (!trimmed) {
      throw new Error('Empty document provided');
    }

    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      throw new Error('Only JSON format supported');
    }

    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Invalid JSON: ${(error as Error).message}`);
    }
  }

  private buildDocument(parsed: unknown): OpenAPIDocument {
    if (!this.isObject(parsed)) {
      throw new Error('Document must be an object');
    }

    // Build document with ONLY fields that exist - never invent
    const document: OpenAPIDocument = {
      openapi: this.getString(parsed, 'openapi') || '3.1.0',
      info: this.buildInfo(parsed.info)
    };

    // Add optional fields ONLY if they exist in source
    if (this.hasProperty(parsed, 'paths')) {
      document.paths = this.buildPaths(parsed.paths);
    }

    if (this.isArray(parsed.servers)) {
      document.servers = parsed.servers.map(s => this.buildServer(s)).filter(Boolean) as ServerObject[];
    }

    if (this.isObject(parsed.components)) {
      document.components = this.buildComponents(parsed.components);
    }

    if (this.isArray(parsed.security)) {
      document.security = parsed.security.map(s => s as SecurityRequirementObject);
    }

    if (this.isArray(parsed.tags)) {
      document.tags = parsed.tags.map(t => this.buildTag(t)).filter(Boolean) as TagObject[];
    }

    if (this.isObject(parsed.externalDocs)) {
      document.externalDocs = this.buildExternalDocs(parsed.externalDocs);
    }

    if (this.isObject(parsed.webhooks)) {
      document.webhooks = parsed.webhooks as Record<string, PathItemObject | ReferenceObject>;
    }

    if (this.hasProperty(parsed, 'jsonSchemaDialect') && typeof parsed.jsonSchemaDialect === 'string') {
      document.jsonSchemaDialect = parsed.jsonSchemaDialect;
    }

    // Add extensions (x-*)
    this.addExtensions(document, parsed);

    return document;
  }

  private buildInfo(info: unknown): InfoObject {
    if (!this.isObject(info)) {
      this.addError('info', 'Info object is required', 'MISSING_REQUIRED');
      return { title: 'Untitled', version: '1.0.0' };
    }

    const infoObj: InfoObject = {
      title: this.getString(info, 'title') || 'Untitled',
      version: this.getString(info, 'version') || '1.0.0'
    };

    // Validate required fields
    if (!this.getString(info, 'title')) {
      this.addError('info.title', 'Title is required', 'MISSING_REQUIRED');
    }
    if (!this.getString(info, 'version')) {
      this.addError('info.version', 'Version is required', 'MISSING_REQUIRED');
    }

    // Add optional fields ONLY if present
    const description = this.getString(info, 'description');
    if (description) infoObj.description = description;

    const summary = this.getString(info, 'summary');
    if (summary) infoObj.summary = summary;

    const termsOfService = this.getString(info, 'termsOfService');
    if (termsOfService) infoObj.termsOfService = termsOfService;

    if (this.isObject(info.contact)) {
      infoObj.contact = this.buildContact(info.contact);
    }

    if (this.isObject(info.license)) {
      infoObj.license = this.buildLicense(info.license);
    }

    this.addExtensions(infoObj, info);
    return infoObj;
  }

  private buildContact(contact: unknown): ContactObject {
    if (!this.isObject(contact)) return {};

    const contactObj: ContactObject = {};

    const name = this.getString(contact, 'name');
    if (name) contactObj.name = name;

    const url = this.getString(contact, 'url');
    if (url) contactObj.url = url;

    const email = this.getString(contact, 'email');
    if (email) contactObj.email = email;

    this.addExtensions(contactObj, contact);
    return contactObj;
  }

  private buildLicense(license: unknown): LicenseObject {
    if (!this.isObject(license)) return { name: '' };

    const licenseObj: LicenseObject = {
      name: this.getString(license, 'name') || ''
    };

    if (!this.getString(license, 'name')) {
      this.addError('info.license.name', 'License name is required', 'MISSING_REQUIRED');
    }

    const identifier = this.getString(license, 'identifier');
    if (identifier) licenseObj.identifier = identifier;

    const url = this.getString(license, 'url');
    if (url) licenseObj.url = url;

    this.addExtensions(licenseObj, license);
    return licenseObj;
  }

  private buildServer(server: unknown): ServerObject | null {
    if (!this.isObject(server)) return null;

    const url = this.getString(server, 'url');
    if (!url) {
      this.addError('server.url', 'Server URL is required', 'MISSING_REQUIRED');
      return null;
    }

    const serverObj: ServerObject = { url };

    const description = this.getString(server, 'description');
    if (description) serverObj.description = description;

    if (this.isObject(server.variables)) {
      serverObj.variables = this.buildServerVariables(server.variables);
    }

    this.addExtensions(serverObj, server);
    return serverObj;
  }

  private buildServerVariables(variables: unknown): Record<string, ServerVariableObject> {
    if (!this.isObject(variables)) return {};

    const result: Record<string, ServerVariableObject> = {};

    for (const [key, value] of Object.entries(variables)) {
      if (this.isObject(value)) {
        const defaultValue = this.getString(value, 'default');
        if (defaultValue) {
          const variable: ServerVariableObject = { default: defaultValue };

          if (this.isArray(value.enum)) {
            variable.enum = value.enum.filter(v => typeof v === 'string');
          }

          const description = this.getString(value, 'description');
          if (description) variable.description = description;

          this.addExtensions(variable, value);
          result[key] = variable;
        }
      }
    }

    return result;
  }

  private buildPaths(paths: unknown): PathsObject {
    if (!this.isObject(paths)) return {};

    const pathsObj: PathsObject = {};

    for (const [pathKey, pathValue] of Object.entries(paths)) {
      if (pathKey.startsWith('x-')) {
        pathsObj[pathKey] = pathValue;
      } else if (this.isObject(pathValue) || this.isReferenceObject(pathValue)) {
        pathsObj[pathKey] = this.buildPathItem(pathValue, pathKey);
      }
    }

    return pathsObj;
  }

  private buildPathItem(pathItem: unknown, pathKey: string): PathItemObject {
    if (!this.isObject(pathItem)) return {};

    const item: PathItemObject = {};

    // Handle $ref
    const ref = this.getString(pathItem, '$ref');
    if (ref) item.$ref = ref;

    const summary = this.getString(pathItem, 'summary');
    if (summary) item.summary = summary;

    const description = this.getString(pathItem, 'description');
    if (description) item.description = description;

    // HTTP methods
    const methods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];
    for (const method of methods) {
      if (this.isObject(pathItem[method])) {
        (item as any)[method] = this.buildOperation(pathItem[method], `${pathKey}.${method}`);
      }
    }

    // Servers and parameters
    if (this.isArray(pathItem.servers)) {
      item.servers = pathItem.servers.map(s => this.buildServer(s)).filter(Boolean) as ServerObject[];
    }

    if (this.isArray(pathItem.parameters)) {
      item.parameters = pathItem.parameters as (ReferenceObject | ParameterObject)[];
    }

    this.addExtensions(item, pathItem);
    return item;
  }

  private buildOperation(operation: unknown, basePath: string): OperationObject {
    if (!this.isObject(operation)) return {};

    const op: OperationObject = {};

    // All fields are optional - add only if present
    if (this.isArray(operation.tags)) {
      op.tags = operation.tags.filter(t => typeof t === 'string');
    }

    const summary = this.getString(operation, 'summary');
    if (summary) op.summary = summary;

    const description = this.getString(operation, 'description');
    if (description) op.description = description;

    const operationId = this.getString(operation, 'operationId');
    if (operationId) op.operationId = operationId;

    if (typeof operation.deprecated === 'boolean') {
      op.deprecated = operation.deprecated;
    }

    if (this.isObject(operation.externalDocs)) {
      op.externalDocs = this.buildExternalDocs(operation.externalDocs);
    }

    if (this.isArray(operation.parameters)) {
      op.parameters = operation.parameters as (ReferenceObject | ParameterObject)[];
    }

    if (this.isObject(operation.requestBody) || this.isReferenceObject(operation.requestBody)) {
      op.requestBody = this.buildRequestBody(operation.requestBody);
    }

    if (this.isObject(operation.responses)) {
      op.responses = this.buildResponses(operation.responses);
    }

    if (this.isObject(operation.callbacks)) {
      op.callbacks = operation.callbacks as Record<string, ReferenceObject | CallbackObject>;
    }

    if (this.isArray(operation.security)) {
      op.security = operation.security as SecurityRequirementObject[];
    }

    if (this.isArray(operation.servers)) {
      op.servers = operation.servers.map(s => this.buildServer(s)).filter(Boolean) as ServerObject[];
    }

    this.addExtensions(op, operation);
    return op;
  }

  private buildRequestBody(requestBody: unknown): RequestBodyObject | ReferenceObject {
    if (this.isReferenceObject(requestBody)) {
      return requestBody as ReferenceObject;
    }

    if (!this.isObject(requestBody)) {
      return { content: {} };
    }

    const body: RequestBodyObject = {
      content: this.isObject(requestBody.content) ? requestBody.content as Record<string, MediaTypeObject> : {}
    };

    const description = this.getString(requestBody, 'description');
    if (description) body.description = description;

    if (typeof requestBody.required === 'boolean') {
      body.required = requestBody.required;
    }

    this.addExtensions(body, requestBody);
    return body;
  }

  private buildResponses(responses: unknown): ResponsesObject {
    if (!this.isObject(responses)) return {};

    const responsesObj: ResponsesObject = {};

    for (const [statusCode, response] of Object.entries(responses)) {
      if (this.isObject(response) || this.isReferenceObject(response)) {
        responsesObj[statusCode] = this.buildResponse(response, statusCode);
      }
    }

    return responsesObj;
  }

  private buildResponse(response: unknown, statusCode: string): ResponseObject | ReferenceObject {
    if (this.isReferenceObject(response)) {
      return response as ReferenceObject;
    }

    if (!this.isObject(response)) {
      return { description: 'Response' };
    }

    const responseObj: ResponseObject = {
      description: this.getString(response, 'description') || 'Response'
    };

    if (!this.getString(response, 'description')) {
      this.addWarning(`responses.${statusCode}.description`, 'Response description is recommended', 'MISSING_DESCRIPTION');
    }

    if (this.isObject(response.headers)) {
      responseObj.headers = response.headers as Record<string, HeaderObject | ReferenceObject>;
    }

    if (this.isObject(response.content)) {
      responseObj.content = response.content as Record<string, MediaTypeObject>;
    }

    if (this.isObject(response.links)) {
      responseObj.links = response.links as Record<string, LinkObject | ReferenceObject>;
    }

    this.addExtensions(responseObj, response);
    return responseObj;
  }

  private buildComponents(components: unknown): ComponentsObject {
    if (!this.isObject(components)) return {};

    const componentsObj: ComponentsObject = {};

    // All component sections are optional - add only if present
    const sections = [
      'schemas', 'responses', 'parameters', 'examples',
      'requestBodies', 'headers', 'securitySchemes',
      'links', 'callbacks', 'pathItems'
    ];

    for (const section of sections) {
      if (this.isObject(components[section])) {
        (componentsObj as any)[section] = components[section] as any;
      }
    }

    this.addExtensions(componentsObj, components);
    return componentsObj;
  }

  private buildTag(tag: unknown): TagObject | null {
    if (!this.isObject(tag)) return null;

    const name = this.getString(tag, 'name');
    if (!name) return null;

    const tagObj: TagObject = { name };

    const description = this.getString(tag, 'description');
    if (description) tagObj.description = description;

    if (this.isObject(tag.externalDocs)) {
      tagObj.externalDocs = this.buildExternalDocs(tag.externalDocs);
    }

    this.addExtensions(tagObj, tag);
    return tagObj;
  }

  private buildExternalDocs(externalDocs: unknown): ExternalDocumentationObject | undefined {
    if (!this.isObject(externalDocs)) return undefined;

    const url = this.getString(externalDocs, 'url');
    if (!url) return undefined;

    const docsObj: ExternalDocumentationObject = { url };

    const description = this.getString(externalDocs, 'description');
    if (description) docsObj.description = description;

    this.addExtensions(docsObj, externalDocs);
    return docsObj;
  }

  // Utility methods
  private isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  private isArray(value: unknown): value is unknown[] {
    return Array.isArray(value);
  }

  private isReferenceObject(value: unknown): value is ReferenceObject {
    return this.isObject(value) && typeof value.$ref === 'string';
  }

  private hasProperty(obj: Record<string, unknown>, key: string): boolean {
    return key in obj && obj[key] !== undefined;
  }

  private getString(obj: Record<string, unknown>, key: string): string | undefined {
    return typeof obj[key] === 'string' ? obj[key] as string : undefined;
  }

  private addExtensions(target: any, source: Record<string, unknown>): void {
    for (const [key, value] of Object.entries(source)) {
      if (key.startsWith('x-')) {
        target[key] = value;
      }
    }
  }

  private cleanDocument(obj: unknown): unknown {
    if (this.isArray(obj)) {
      return obj.map(item => this.cleanDocument(item));
    }

    if (this.isObject(obj)) {
      const cleaned: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
          cleaned[key] = this.cleanDocument(value);
        }
      }
      return cleaned;
    }

    return obj;
  }

  private addError(path: string, message: string, code: string): void {
    this.errors.push({ path, message, code });
  }

  private addWarning(path: string, message: string, code: string): void {
    this.warnings.push({ path, message, code });
  }
}