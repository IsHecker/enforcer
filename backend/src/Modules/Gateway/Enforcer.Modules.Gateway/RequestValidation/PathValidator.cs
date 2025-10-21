namespace Enforcer.Modules.Gateway.RequestValidation;

public static class PathValidator
{
    public static bool IsValidPath(ReadOnlySpan<char> path)
    {
        if (path.IsEmpty)
            return true;

        while (!path.IsEmpty)
        {
            int slashIndex = path.IndexOf('/');

            ReadOnlySpan<char> segment;

            if (slashIndex == -1)
            {
                segment = path;
                path = [];
            }
            else
            {
                // Get the segment before the slash
                segment = path[..slashIndex];

                // Advance the span past the slash
                path = path[(slashIndex + 1)..];
            }

            if (!IsValidSegment(segment))
                return false;
        }

        return true;
    }

    private static bool IsValidSegment(ReadOnlySpan<char> segment)
    {
        // If a segment is empty, it means the original path had consecutive slashes ("//").
        if (segment.IsEmpty)
            return false;

        if (!char.IsLetterOrDigit(segment[0]) || !char.IsLetterOrDigit(segment[^1]))
            return false;

        ReadOnlySpan<char> Separators = "-._";

        for (int i = 0; i < segment.Length; i++)
        {
            char currentChar = segment[i];

            if (char.IsLetterOrDigit(currentChar))
                continue;

            if (!Separators.Contains(currentChar))
                return false;

            char previousChar = segment[i - 1];
            if (Separators.Contains(previousChar))
                return false;
        }

        return true;
    }
}