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
}