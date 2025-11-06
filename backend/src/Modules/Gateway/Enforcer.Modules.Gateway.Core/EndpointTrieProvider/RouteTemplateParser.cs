namespace Enforcer.Modules.Gateway.Core.EndpointTrieProvider;

internal static class RouteTemplateParser
{
    public static IEnumerable<RouteSegment> Parse(string template)
    {
        if (string.IsNullOrEmpty(template))
            yield break;

        int currentIndex = 0;
        while (TryGetNextSegment(template, ref currentIndex, out var range))
        {
            var part = template.AsSpan()[range.start..range.end];

            if (part[0] == '{' && part[^1] == '}')
            {
                var paramContent = part[1..^1];
                var isOptional = paramContent.EndsWith("?");
                var paramName = isOptional ? paramContent[..^1] : paramContent;

                yield return RouteSegment.Parameter(paramName.ToString(), isOptional);

                continue;
            }

            yield return RouteSegment.Literal(part.ToString());
        }
    }

    private static bool TryGetNextSegment(ReadOnlySpan<char> span, ref int currentIndex, out (int start, int end) range)
    {
        while (currentIndex < span.Length && span[currentIndex] == '/')
            currentIndex++;

        if (currentIndex >= span.Length)
        {
            range = default;
            return false;
        }

        int end = currentIndex;
        while (end < span.Length && span[end] != '/')
            end++;

        range = (currentIndex, end);
        currentIndex = end + 1;
        return true;
    }
}