'use client';

import { Badge } from '@/components/ui/badge';

interface RouteDisplayProps {
  route: string;
  className?: string;
}

/**
 * Global utility component for displaying routes with path parameter badges
 * Converts routes like "/alerts/{id}/sick" to "/alerts/[id]/sick" where [id] is a colored badge
 */
export function RouteDisplay({ route, className = '' }: RouteDisplayProps) {
  // Extract path parameters from route
  const extractPathParameters = (path: string): string[] => {
    const matches = path.match(/{([^}]+)}/g);
    return matches ? matches.map(match => match.slice(1, -1)) : [];
  };

  const params = extractPathParameters(route);
  
  // If no path parameters, return plain text
  if (params.length === 0) {
    return <span className={`font-mono ${className}`}>{route}</span>;
  }

  // Split the route and insert badges for parameters
  const parts = route.split(/{[^}]+}/);
  const result: (string | JSX.Element)[] = [];

  for (let i = 0; i < parts.length; i++) {
    if (parts[i]) {
      result.push(parts[i]);
    }
    if (i < params.length) {
      result.push(
        <Badge 
          key={`param-${i}`}
          variant="secondary" 
          className="mx-1 text-xs bg-blue-500/20 text-blue-400 border-blue-500/30"
        >
          {params[i]}
        </Badge>
      );
    }
  }

  return (
    <span className={`inline-flex items-center flex-wrap font-mono ${className}`}>
      {result}
    </span>
  );
}

/**
 * Utility function to extract path parameters from a route string
 * Used by other components for parameter detection
 */
export const extractPathParameters = (path: string): string[] => {
  const matches = path.match(/{([^}]+)}/g);
  return matches ? matches.map(match => match.slice(1, -1)) : [];
};

/**
 * Component for displaying detected parameters as inline badges
 * Used in forms to show detected path parameters horizontally
 */
interface DetectedParametersProps {
  route: string;
  label?: string;
  className?: string;
}

export function DetectedParameters({ route, label = "Detected Parameters:", className = '' }: DetectedParametersProps) {
  const params = extractPathParameters(route);
  
  if (params.length === 0) {
    return null;
  }

  return (
    <div className={`mt-2 p-2 bg-muted/20 rounded border ${className}`}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex items-center space-x-1 flex-wrap">
        {params.map((param, index) => (
          <span key={index} className="inline-flex items-center">
            <Badge 
              variant="secondary" 
              className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30"
            >
              {param}
            </Badge>
            {index < params.length - 1 && <span className="text-muted-foreground text-xs ml-1">,</span>}
          </span>
        ))}
      </div>
    </div>
  );
}