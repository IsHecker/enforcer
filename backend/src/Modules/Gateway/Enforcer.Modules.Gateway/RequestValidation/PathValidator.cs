namespace Enforcer.Modules.Gateway.RequestValidation;

public class PathValidator
{
    public static bool IsValidPath(ReadOnlySpan<char> path)
    {
        if (path.IsEmpty)
            return true;

        bool isInSegment = false;
        bool lastCharacterWasSeparator = false;

        ReadOnlySpan<char> ValidSeparators = "-._";

        for (int i = 0; i < path.Length; i++)
        {
            char currentChar = path[i];

            if (currentChar == '/')
            {
                if (!isInSegment || lastCharacterWasSeparator)
                    return false;

                isInSegment = false;
                lastCharacterWasSeparator = false;
                continue;
            }

            bool isAlphanumeric = char.IsLetterOrDigit(currentChar);
            bool isSeparator = ValidSeparators.Contains(currentChar);

            if (!isAlphanumeric && !isSeparator)
                return false;

            if (!isInSegment)
            {
                if (!isAlphanumeric)
                    return false;

                isInSegment = true;
            }

            if (!isSeparator)
            {
                lastCharacterWasSeparator = false;
                continue;
            }

            if (lastCharacterWasSeparator)
                return false;

            lastCharacterWasSeparator = true;

        }

        return !lastCharacterWasSeparator;
    }

    // public static bool IsValidPath(ReadOnlySpan<char> requestPath)
    // {
    //     if (requestPath.IsEmpty)
    //         return true;

    //     while (!requestPath.IsEmpty)
    //     {
    //         int separatorIndex = requestPath.IndexOf('/');

    //         ReadOnlySpan<char> currentSegment;

    //         if (separatorIndex == -1)
    //         {
    //             currentSegment = requestPath;
    //             requestPath = [];
    //         }
    //         else
    //         {
    //             // Get the segment before the slash
    //             currentSegment = requestPath[..separatorIndex];

    //             // Advance the span past the current segment and the single '/'
    //             requestPath = requestPath[(separatorIndex + 1)..];
    //         }

    //         // If a segment is empty here, it means the original path had consecutive slashes ("//").
    //         if (currentSegment.IsEmpty)
    //             return false;

    //         if (!IsValidSegment(currentSegment))
    //             return false;
    //     }

    //     return true;
    // }

    // private static bool IsValidSegment(ReadOnlySpan<char> segment)
    // {
    //     if (segment.IsEmpty)
    //         return false;

    //     if (!char.IsLetterOrDigit(segment[0]) || !char.IsLetterOrDigit(segment[^1]))
    //         return false;

    //     ReadOnlySpan<char> Separators = "-._";

    //     for (int i = 0; i < segment.Length; i++)
    //     {
    //         char currentChar = segment[i];

    //         if (char.IsLetterOrDigit(currentChar))
    //             continue;

    //         if (!Separators.Contains(currentChar))
    //             return false;

    //         char previousChar = segment[i - 1];
    //         if (Separators.Contains(previousChar))
    //             return false;
    //     }

    //     return true;
    // }
}