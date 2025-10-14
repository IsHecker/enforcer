# Things to do later

### Endpoint Trie
* Endpoints with fewer optional parameters should override those with more.

### RateLimitMiddleware
* Implement Write-back to update QuotaUsage tables from the cache periodically using background job.

### URLs and Route Patterns

* Always store `TargetBaseUrl` **with** a one trailing slash.
* Always store `Public` and `Target` paths **without** any leading or trailing slashes.