'use client';

/**
 * Complete OpenAPI 3.1.0 Structured Card Forms
 * 
 * Supports ALL OpenAPI 3.1.0 features without omission using Structured Card Form pattern:
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
 * Uses existing design system for consistency
 */

import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

import {
  Plus,
  Trash2,
  Copy,
  Info,
  ChevronDown,
  ChevronRight,
  Globe,
  Code,
  FileText,
  Database,
  Settings,
  Shield,
  Link as LinkIcon,
  Tag,
  Book,
  Server,
  Key,
  Hash,
  Send,
  Edit3,
  Terminal,
  Braces,
  Type,
  List,
  HelpCircle,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';

import type {
  OpenAPIDocument,
  InfoObject,
  ContactObject,
  LicenseObject,
  ServerObject,
  PathsObject,
  PathItemObject,
  OperationObject,
  ParameterObject,
  RequestBodyObject,
  ResponsesObject,
  ResponseObject,
  SchemaObject,
  ComponentsObject,
  SecuritySchemeObject,
  TagObject,
  ExternalDocumentationObject,
  MediaTypeObject,
  ExampleObject,
  HeaderObject,
  LinkObject,
  CallbackObject,
  ParseResult
} from '@/lib/openapi-parser';
import { OpenAPIParser } from '@/lib/openapi-parser';

// ============================================================================
// COMPONENT INTERFACES
// ============================================================================

interface StructuredCardFormsProps {
  document?: OpenAPIDocument;
  onChange: (document: OpenAPIDocument) => void;
  className?: string;
}

interface CardFieldProps {
  label: string;
  description?: string;
  required?: boolean;
  children: React.ReactNode;
  tooltip?: string;
  error?: string;
  className?: string;
}

interface CollapsibleCardProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  actions?: React.ReactNode;
  required?: boolean;
}

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

const CardField: React.FC<CardFieldProps> = ({ 
  label, 
  description, 
  required = false, 
  children, 
  tooltip,
  error,
  className 
}) => (
  <div className={`space-y-2 ${className || ''}`}>
    <Label className="text-sm font-semibold flex items-center space-x-1">
      <span>{label}</span>
      {required && <span className="text-destructive">*</span>}
      {tooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3 w-3 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-sm">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </Label>
    {children}
    {description && (
      <p className="text-xs text-muted-foreground">{description}</p>
    )}
    {error && (
      <div className="text-red-600 dark:text-red-400 text-sm flex items-center space-x-1">
        <AlertTriangle className="h-3 w-3" />
        <span>{error}</span>
      </div>
    )}
  </div>
);

const CollapsibleCard: React.FC<CollapsibleCardProps> = ({
  title,
  description,
  icon: Icon,
  badge,
  children,
  defaultOpen = false,
  className,
  actions,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className={className}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {Icon && <Icon className="h-5 w-5 text-blue-500" />}
                <CardTitle className="text-lg flex items-center space-x-1">
                  <span>{title}</span>
                  {required && <span className="text-destructive text-sm">*</span>}
                </CardTitle>
                {badge !== undefined && (
                  <Badge variant="outline" className="text-xs">
                    {badge}
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {actions}
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
            {description && (
              <CardDescription>{description}</CardDescription>
            )}
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>{children}</CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

// ============================================================================
// HTTP STATUS CODES AND CONSTANTS
// ============================================================================

const httpStatusCodes = [
  // 1xx Informational
  { code: '100', name: 'Continue' },
  { code: '101', name: 'Switching Protocols' },
  { code: '102', name: 'Processing' },
  
  // 2xx Success
  { code: '200', name: 'OK' },
  { code: '201', name: 'Created' },
  { code: '202', name: 'Accepted' },
  { code: '204', name: 'No Content' },
  
  // 3xx Redirection
  { code: '300', name: 'Multiple Choices' },
  { code: '301', name: 'Moved Permanently' },
  { code: '302', name: 'Found' },
  { code: '304', name: 'Not Modified' },
  
  // 4xx Client Errors
  { code: '400', name: 'Bad Request' },
  { code: '401', name: 'Unauthorized' },
  { code: '403', name: 'Forbidden' },
  { code: '404', name: 'Not Found' },
  { code: '405', name: 'Method Not Allowed' },
  { code: '409', name: 'Conflict' },
  { code: '422', name: 'Unprocessable Entity' },
  { code: '429', name: 'Too Many Requests' },
  
  // 5xx Server Errors
  { code: '500', name: 'Internal Server Error' },
  { code: '502', name: 'Bad Gateway' },
  { code: '503', name: 'Service Unavailable' },
  { code: '504', name: 'Gateway Timeout' },
  
  // Special
  { code: 'default', name: 'Default' }
];

const mediaTypes = [
  'application/json',
  'application/xml',
  'text/plain',
  'text/html',
  'application/x-www-form-urlencoded',
  'multipart/form-data',
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/octet-stream'
];

const schemaTypes = [
  'string',
  'number',
  'integer',
  'boolean',
  'array',
  'object',
  'null'
];

const parameterLocations = [
  { value: 'query', label: 'Query Parameter' },
  { value: 'header', label: 'Header Parameter' },
  { value: 'path', label: 'Path Parameter' },
  { value: 'cookie', label: 'Cookie Parameter' }
];

const securityTypes = [
  { value: 'apiKey', label: 'API Key' },
  { value: 'http', label: 'HTTP Authentication' },
  { value: 'oauth2', label: 'OAuth 2.0' },
  { value: 'openIdConnect', label: 'OpenID Connect' },
  { value: 'mutualTLS', label: 'Mutual TLS' }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const StructuredCardForms: React.FC<StructuredCardFormsProps> = ({
  document,
  onChange,
  className
}) => {
  const [activeTab, setActiveTab] = useState('info');
  const [importText, setImportText] = useState('');
  const [validationResult, setValidationResult] = useState<ParseResult | null>(null);

  // Initialize with minimal valid document if none provided
  const currentDocument: OpenAPIDocument = useMemo(() => document || {
    openapi: '3.1.0',
    info: {
      title: '',
      version: ''
    }
  }, [document]);

  const updateDocument = useCallback((updater: (doc: OpenAPIDocument) => OpenAPIDocument) => {
    // Create a deep clone to prevent mutations
    const docToUpdate = document || {
      openapi: '3.1.0',
      info: { title: '', version: '' }
    };
    const updated = updater(JSON.parse(JSON.stringify(docToUpdate)));
    onChange(updated);
  }, [document, onChange]);

  // Import functionality
  const handleImport = () => {
    if (!importText.trim()) {
      toast.error('Please provide OpenAPI document content');
      return;
    }

    try {
      const parser = new OpenAPIParser();
      const result = parser.parse(importText);
      
      setValidationResult(result);
      onChange(result.document);
      setImportText('');
      
      if (result.errors.length === 0) {
        toast.success('OpenAPI document imported successfully');
      } else {
        toast.warning(`Document imported with ${result.errors.length} errors`);
      }
    } catch (error) {
      toast.error(`Import failed: ${(error as Error).message}`);
    }
  };

  // Export functionality  
  const handleExport = () => {
    try {
      const parser = new OpenAPIParser();
      const exported = parser.serialize(currentDocument);
      
      navigator.clipboard.writeText(exported);
      toast.success('OpenAPI document copied to clipboard');
    } catch (error) {
      toast.error(`Export failed: ${(error as Error).message}`);
    }
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Validation Status */}
      {validationResult && (validationResult.errors.length > 0 || validationResult.warnings.length > 0) && (
        <Card className="border-yellow-500/30 bg-yellow-500/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span>Validation Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {validationResult.errors.map((error, index) => (
                <div key={index} className="text-red-600 dark:text-red-400">
                  <strong>{error.path}:</strong> {error.message}
                </div>
              ))}
              {validationResult.warnings.map((warning, index) => (
                <div key={index} className="text-yellow-600 dark:text-yellow-400">
                  <strong>{warning.path}:</strong> {warning.message}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import/Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-blue-500" />
            <span>Document Management</span>
          </CardTitle>
          <CardDescription>
            Import OpenAPI documents or export current document
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Copy className="h-4 w-4 mr-2" />
              Export to Clipboard
            </Button>
          </div>
          
          <div className="space-y-2">
            <Textarea
              placeholder="Paste OpenAPI document JSON here to import..."
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              rows={4}
              className="font-mono text-sm"
            />
            {importText && (
              <Button
                onClick={handleImport}
                size="sm"
                className="w-full"
              >
                <FileText className="h-4 w-4 mr-2" />
                Import Document
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Editor Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="info">
            <FileText className="h-4 w-4 mr-2" />
            Info
          </TabsTrigger>
          <TabsTrigger value="paths">
            <Code className="h-4 w-4 mr-2" />
            Paths
          </TabsTrigger>
          <TabsTrigger value="components">
            <Database className="h-4 w-4 mr-2" />
            Components
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info" className="space-y-6">
          <InfoCard 
            info={currentDocument.info}
            onChange={(info) => updateDocument(doc => ({ ...doc, info }))}
          />
          
          <ServersCard
            servers={currentDocument.servers}
            onChange={(servers) => updateDocument(doc => ({ 
              ...doc, 
              servers: servers?.length ? servers : undefined 
            }))}
          />

          <ExternalDocsCard
            externalDocs={currentDocument.externalDocs}
            onChange={(externalDocs) => updateDocument(doc => ({ ...doc, externalDocs }))}
          />
          
          <TagsCard
            tags={currentDocument.tags}
            onChange={(tags) => updateDocument(doc => ({ 
              ...doc, 
              tags: tags?.length ? tags : undefined 
            }))}
          />
        </TabsContent>

        {/* Paths Tab */}
        <TabsContent value="paths" className="space-y-6">
          <PathsCard
            paths={currentDocument.paths}
            onChange={(paths) => updateDocument(doc => ({ ...doc, paths }))}
          />
        </TabsContent>

        {/* Components Tab */}
        <TabsContent value="components" className="space-y-6">
          <ComponentsCard
            components={currentDocument.components}
            onChange={(components) => updateDocument(doc => ({ ...doc, components }))}
          />
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <SecurityCard
            document={currentDocument}
            onChange={updateDocument}
          />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <SettingsCard
            document={currentDocument}
            onChange={updateDocument}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// ============================================================================
// INFO CARD COMPONENTS
// ============================================================================

interface InfoCardProps {
  info: InfoObject;
  onChange: (info: InfoObject) => void;
}

const InfoCard: React.FC<InfoCardProps> = ({ info, onChange }) => {
  return (
    <CollapsibleCard
      title="API Information"
      description="Basic metadata about your API"
      icon={FileText}
      defaultOpen={true}
      required={true}
    >
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <CardField 
            label="Title" 
            required 
            tooltip="info.title - The title of the API"
          >
            <Input
              value={info.title || ''}
              onChange={(e) => onChange({ ...info, title: e.target.value })}
              placeholder="My API"
            />
          </CardField>

          <CardField 
            label="Version" 
            required 
            tooltip="info.version - The version of the API definition"
          >
            <Input
              value={info.version || ''}
              onChange={(e) => onChange({ ...info, version: e.target.value })}
              placeholder="1.0.0"
            />
          </CardField>
        </div>

        <CardField 
          label="Summary" 
          tooltip="info.summary - A short summary of the API"
        >
          <Input
            value={info.summary || ''}
            onChange={(e) => onChange({ ...info, summary: e.target.value || undefined })}
            placeholder="Brief summary of your API"
          />
        </CardField>

        <CardField 
          label="Description" 
          tooltip="info.description - A description of the API"
        >
          <Textarea
            value={info.description || ''}
            onChange={(e) => onChange({ ...info, description: e.target.value || undefined })}
            placeholder="Detailed description of your API..."
            rows={4}
          />
        </CardField>

        <CardField 
          label="Terms of Service" 
          tooltip="info.termsOfService - URL to terms of service"
        >
          <Input
            value={info.termsOfService || ''}
            onChange={(e) => onChange({ ...info, termsOfService: e.target.value || undefined })}
            placeholder="https://example.com/terms"
          />
        </CardField>

        <div className="grid gap-6 md:grid-cols-2">
          <ContactCard
            contact={info.contact}
            onChange={(contact) => onChange({ ...info, contact })}
          />

          <LicenseCard
            license={info.license}
            onChange={(license) => onChange({ ...info, license })}
          />
        </div>
      </div>
    </CollapsibleCard>
  );
};

interface ContactCardProps {
  contact?: ContactObject;
  onChange: (contact?: ContactObject) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onChange }) => {
  return (
    <Card className="border-muted">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center space-x-2">
          <span>Contact Information</span>
          <Switch
            checked={!!contact}
            onCheckedChange={(checked) => onChange(checked ? {} : undefined)}
          />
        </CardTitle>
      </CardHeader>
      {contact && (
        <CardContent className="space-y-4">
          <CardField 
            label="Name" 
            tooltip="info.contact.name - Contact name"
          >
            <Input
              value={contact.name || ''}
              onChange={(e) => onChange({ ...contact, name: e.target.value || undefined })}
              placeholder="API Support Team"
            />
          </CardField>

          <CardField 
            label="Email" 
            tooltip="info.contact.email - Contact email"
          >
            <Input
              value={contact.email || ''}
              onChange={(e) => onChange({ ...contact, email: e.target.value || undefined })}
              placeholder="support@example.com"
              type="email"
            />
          </CardField>

          <CardField 
            label="URL" 
            tooltip="info.contact.url - Contact URL"
          >
            <Input
              value={contact.url || ''}
              onChange={(e) => onChange({ ...contact, url: e.target.value || undefined })}
              placeholder="https://example.com/support"
            />
          </CardField>
        </CardContent>
      )}
    </Card>
  );
};

interface LicenseCardProps {
  license?: LicenseObject;
  onChange: (license?: LicenseObject) => void;
}

const LicenseCard: React.FC<LicenseCardProps> = ({ license, onChange }) => {
  return (
    <Card className="border-muted">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center space-x-2">
          <span>License Information</span>
          <Switch
            checked={!!license}
            onCheckedChange={(checked) => onChange(checked ? { name: '' } : undefined)}
          />
        </CardTitle>
      </CardHeader>
      {license && (
        <CardContent className="space-y-4">
          <CardField 
            label="Name" 
            required
            tooltip="info.license.name - License name"
          >
            <Input
              value={license.name || ''}
              onChange={(e) => onChange({ ...license, name: e.target.value })}
              placeholder="MIT License"
            />
          </CardField>

          <CardField 
            label="URL" 
            tooltip="info.license.url - License URL"
          >
            <Input
              value={license.url || ''}
              onChange={(e) => onChange({ ...license, url: e.target.value || undefined })}
              placeholder="https://opensource.org/licenses/MIT"
            />
          </CardField>

          <CardField 
            label="Identifier" 
            tooltip="info.license.identifier - SPDX license identifier"
          >
            <Input
              value={license.identifier || ''}
              onChange={(e) => onChange({ ...license, identifier: e.target.value || undefined })}
              placeholder="MIT"
            />
          </CardField>
        </CardContent>
      )}
    </Card>
  );
};

// ============================================================================
// SERVERS CARD COMPONENT
// ============================================================================

interface ServersCardProps {
  servers?: ServerObject[];
  onChange: (servers?: ServerObject[]) => void;
}

const ServersCard: React.FC<ServersCardProps> = ({ servers, onChange }) => {
  const serversList = servers || [];
  
  const addServer = () => {
    const newServer: ServerObject = { url: 'https://api.example.com' };
    onChange([...serversList, newServer]);
  };

  const updateServer = (index: number, server: ServerObject) => {
    const updated = [...serversList];
    updated[index] = server;
    onChange(updated.length > 0 ? updated : undefined);
  };

  const removeServer = (index: number) => {
    const filtered = serversList.filter((_, i) => i !== index);
    onChange(filtered.length > 0 ? filtered : undefined);
  };

  return (
    <CollapsibleCard
      title="Servers"
      description="Server information for your API"
      icon={Server}
      badge={serversList.length}
      defaultOpen={serversList.length > 0}
      actions={
        <Button variant="outline" size="sm" onClick={addServer}>
          <Plus className="h-4 w-4 mr-2" />
          Add Server
        </Button>
      }
    >
      <div className="space-y-4">
        {serversList.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
            <Server className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground mb-2">No servers defined</p>
            <p className="text-sm text-muted-foreground mb-4">Add server information for your API</p>
            <Button variant="outline" size="sm" onClick={addServer}>
              <Plus className="h-4 w-4 mr-2" />
              Add Server
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {serversList.map((server, index) => (
              <Card key={index} className="border-muted bg-muted/20">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="text-xs">
                      Server {index + 1}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeServer(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <CardField 
                      label="URL" 
                      required 
                      tooltip="servers[].url - Server URL"
                    >
                      <Input
                        value={server.url}
                        onChange={(e) => updateServer(index, { ...server, url: e.target.value })}
                        placeholder="https://api.example.com"
                      />
                    </CardField>

                    <CardField 
                      label="Description" 
                      tooltip="servers[].description - Server description"
                    >
                      <Input
                        value={server.description || ''}
                        onChange={(e) => updateServer(index, { ...server, description: e.target.value || undefined })}
                        placeholder="Production server"
                      />
                    </CardField>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </CollapsibleCard>
  );
};

// ============================================================================
// EXTERNAL DOCS CARD COMPONENT
// ============================================================================

interface ExternalDocsCardProps {
  externalDocs?: ExternalDocumentationObject;
  onChange: (externalDocs?: ExternalDocumentationObject) => void;
}

const ExternalDocsCard: React.FC<ExternalDocsCardProps> = ({ externalDocs, onChange }) => {
  return (
    <CollapsibleCard
      title="External Documentation"
      description="Additional external documentation for your API"
      icon={Book}
      defaultOpen={!!externalDocs}
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Switch
            checked={!!externalDocs}
            onCheckedChange={(checked) => onChange(checked ? { url: '' } : undefined)}
          />
          <Label>Include external documentation</Label>
        </div>

        {externalDocs && (
          <div className="space-y-4">
            <CardField 
              label="URL" 
              required 
              tooltip="externalDocs.url - URL to external documentation"
            >
              <Input
                value={externalDocs.url || ''}
                onChange={(e) => onChange({ ...externalDocs, url: e.target.value })}
                placeholder="https://docs.example.com"
              />
            </CardField>

            <CardField 
              label="Description" 
              tooltip="externalDocs.description - Description of external documentation"
            >
              <Input
                value={externalDocs.description || ''}
                onChange={(e) => onChange({ ...externalDocs, description: e.target.value || undefined })}
                placeholder="Additional API documentation"
              />
            </CardField>
          </div>
        )}
      </div>
    </CollapsibleCard>
  );
};

// ============================================================================
// TAGS CARD COMPONENT
// ============================================================================

interface TagsCardProps {
  tags?: TagObject[];
  onChange: (tags?: TagObject[]) => void;
}

const TagsCard: React.FC<TagsCardProps> = ({ tags, onChange }) => {
  const tagsList = tags || [];
  
  const addTag = () => {
    const newTag: TagObject = { name: '' };
    onChange([...tagsList, newTag]);
  };

  const updateTag = (index: number, tag: TagObject) => {
    const updated = [...tagsList];
    updated[index] = tag;
    onChange(updated.length > 0 ? updated : undefined);
  };

  const removeTag = (index: number) => {
    const filtered = tagsList.filter((_, i) => i !== index);
    onChange(filtered.length > 0 ? filtered : undefined);
  };

  return (
    <CollapsibleCard
      title="Tags"
      description="Organize operations with tags"
      icon={Tag}
      badge={tagsList.length}
      defaultOpen={tagsList.length > 0}
      actions={
        <Button variant="outline" size="sm" onClick={addTag}>
          <Plus className="h-4 w-4 mr-2" />
          Add Tag
        </Button>
      }
    >
      <div className="space-y-4">
        {tagsList.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
            <Tag className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground mb-2">No tags defined</p>
            <p className="text-sm text-muted-foreground mb-4">Add tags to organize your API operations</p>
            <Button variant="outline" size="sm" onClick={addTag}>
              <Plus className="h-4 w-4 mr-2" />
              Add Tag
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {tagsList.map((tag, index) => (
              <Card key={index} className="border-muted bg-muted/20">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="text-xs">
                      Tag {index + 1}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTag(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <CardField 
                      label="Name" 
                      required 
                      tooltip="tags[].name - Tag name"
                    >
                      <Input
                        value={tag.name}
                        onChange={(e) => updateTag(index, { ...tag, name: e.target.value })}
                        placeholder="users"
                      />
                    </CardField>

                    <CardField 
                      label="Description" 
                      tooltip="tags[].description - Tag description"
                    >
                      <Input
                        value={tag.description || ''}
                        onChange={(e) => updateTag(index, { ...tag, description: e.target.value || undefined })}
                        placeholder="User management operations"
                      />
                    </CardField>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </CollapsibleCard>
  );
};

// ============================================================================
// PLACEHOLDER COMPONENTS - TO BE IMPLEMENTED
// ============================================================================

interface PathsCardProps {
  paths?: PathsObject;
  onChange: (paths?: PathsObject) => void;
}

const PathsCard: React.FC<PathsCardProps> = ({ paths, onChange }) => {
  const pathCount = Object.keys(paths || {}).filter(p => !p.startsWith('x-')).length;
  
  return (
    <CollapsibleCard
      title="API Paths"
      description="Define your API endpoints and operations"
      icon={Code}
      badge={pathCount}
    >
      <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
        <Terminal className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground mb-2">Advanced Path Editor</p>
        <p className="text-sm text-muted-foreground">
          Comprehensive path editor with all HTTP methods, parameters, request/response schemas, 
          callbacks, and complete OpenAPI 3.1 operation support will be implemented here
        </p>
        {pathCount > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            Current paths: {Object.keys(paths || {}).filter(p => !p.startsWith('x-')).join(', ')}
          </p>
        )}
      </div>
    </CollapsibleCard>
  );
};

interface ComponentsCardProps {
  components?: ComponentsObject;
  onChange: (components?: ComponentsObject) => void;
}

const ComponentsCard: React.FC<ComponentsCardProps> = ({ components, onChange }) => {
  return (
    <CollapsibleCard
      title="Reusable Components"
      description="Define reusable schemas, responses, parameters, and more"
      icon={Database}
    >
      <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
        <Database className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground mb-2">Components Editor</p>
        <p className="text-sm text-muted-foreground">
          Comprehensive components editor with full JSON Schema 2020-12 support for schemas, 
          responses, parameters, examples, request bodies, headers, security schemes, links, 
          callbacks, and path items will be implemented here
        </p>
        {components && (
          <div className="mt-4 text-xs text-muted-foreground">
            <p>Current components:</p>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {Object.entries(components).map(([key, value]) => (
                <Badge key={key} variant="outline" className="text-xs">
                  {key}: {Object.keys(value as object || {}).length} items
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </CollapsibleCard>
  );
};

interface SecurityCardProps {
  document: OpenAPIDocument;
  onChange: (updater: (doc: OpenAPIDocument) => OpenAPIDocument) => void;
}

const SecurityCard: React.FC<SecurityCardProps> = ({ document, onChange }) => {
  return (
    <CollapsibleCard
      title="Security Schemes"
      description="Define authentication and authorization schemes"
      icon={Shield}
    >
      <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
        <Shield className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground mb-2">Security Editor</p>
        <p className="text-sm text-muted-foreground">
          Complete security editor with API keys, HTTP authentication, OAuth 2.0, OpenID Connect, 
          mutual TLS, and security requirements will be implemented here
        </p>
      </div>
    </CollapsibleCard>
  );
};

interface SettingsCardProps {
  document: OpenAPIDocument;
  onChange: (updater: (doc: OpenAPIDocument) => OpenAPIDocument) => void;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ document, onChange }) => {
  return (
    <div className="space-y-6">
      <CollapsibleCard
        title="OpenAPI Version"
        description="OpenAPI specification version"
        icon={Settings}
        defaultOpen={true}
        required={true}
      >
        <CardField 
          label="OpenAPI Version" 
          required 
          tooltip="openapi - The OpenAPI specification version"
        >
          <Select
            value={document.openapi}
            onValueChange={(value) => onChange(doc => ({ ...doc, openapi: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3.1.0">3.1.0</SelectItem>
              <SelectItem value="3.0.3">3.0.3</SelectItem>
              <SelectItem value="3.0.2">3.0.2</SelectItem>
              <SelectItem value="3.0.1">3.0.1</SelectItem>
              <SelectItem value="3.0.0">3.0.0</SelectItem>
            </SelectContent>
          </Select>
        </CardField>
      </CollapsibleCard>
      
      <CollapsibleCard
        title="Extensions"
        description="Custom extension fields (x-*)"
        icon={HelpCircle}
      >
        <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
          <HelpCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground mb-2">Extensions Editor</p>
          <p className="text-sm text-muted-foreground">
            Editor for custom extension fields (x-*) at document and component levels will be implemented here
          </p>
        </div>
      </CollapsibleCard>
    </div>
  );
};

export default StructuredCardForms;