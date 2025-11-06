using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Running;
using BenchmarkDotNet.Jobs;
using BenchmarkDotNet.Configs;
using BenchmarkDotNet.Columns;
using BenchmarkDotNet.Reports;

[MemoryDiagnoser]
[SimpleJob(RuntimeMoniker.Net80, baseline: true)]
[SimpleJob(RuntimeMoniker.Net90)]
[RankColumn]
[MinColumn, MaxColumn, MeanColumn, MedianColumn]
[MarkdownExporter, HtmlExporter]
public class PathValidatorBenchmarks
{
    // Test data covering various scenarios
    private string _shortValidPath = null!;
    private string _longValidPath = null!;
    private string _veryLongValidPath = null!;
    private string _complexValidPath = null!;
    private string _invalidStartPath = null!;
    private string _invalidEndPath = null!;
    private string _invalidDoubleSeparator = null!;
    private string _invalidConsecutiveSlash = null!;
    private string _emptyPath = null!;
    private string _singleSegment = null!;
    private string _deeplyNested = null!;

    [GlobalSetup]
    public void Setup()
    {
        _shortValidPath = "api/v1";
        _longValidPath = "api/v1/users/123/profile/settings";
        _veryLongValidPath = string.Join("/", Enumerable.Range(0, 20).Select(i => $"segment{i}"));
        _complexValidPath = "api_v1.2-beta/users_123/profile-data.json";
        _invalidStartPath = "-api/v1/users";
        _invalidEndPath = "api/v1/users-";
        _invalidDoubleSeparator = "api/v1--users/profile";
        _invalidConsecutiveSlash = "api//v1/users";
        _emptyPath = "";
        _singleSegment = "api";
        _deeplyNested = string.Join("/", Enumerable.Range(0, 50).Select(i => $"seg{i}"));
    }

    // ============ V1 Benchmarks ============

    [Benchmark]
    public bool V1_ShortValid() => PathValidator.IsValidPathV1(_shortValidPath);
    [Benchmark]
    public bool V2_ShortValid() => PathValidator.IsValidPathV2(_shortValidPath);

    [Benchmark]
    public bool V1_LongValid() => PathValidator.IsValidPathV1(_longValidPath);
    [Benchmark]
    public bool V2_LongValid() => PathValidator.IsValidPathV2(_longValidPath);

    [Benchmark]
    public bool V1_VeryLongValid() => PathValidator.IsValidPathV1(_veryLongValidPath);
    [Benchmark]
    public bool V2_VeryLongValid() => PathValidator.IsValidPathV2(_veryLongValidPath);


    [Benchmark]
    public bool V1_ComplexValid() => PathValidator.IsValidPathV1(_complexValidPath);
    [Benchmark]
    public bool V2_ComplexValid() => PathValidator.IsValidPathV2(_complexValidPath);

    [Benchmark]
    public bool V1_InvalidStart() => PathValidator.IsValidPathV1(_invalidStartPath);
    [Benchmark]
    public bool V2_InvalidStart() => PathValidator.IsValidPathV2(_invalidStartPath);

    [Benchmark]
    public bool V1_InvalidEnd() => PathValidator.IsValidPathV1(_invalidEndPath);
    [Benchmark]
    public bool V2_InvalidEnd() => PathValidator.IsValidPathV2(_invalidEndPath);

    [Benchmark]
    public bool V1_InvalidDoubleSeparator() => PathValidator.IsValidPathV1(_invalidDoubleSeparator);
    [Benchmark]
    public bool V2_InvalidDoubleSeparator() => PathValidator.IsValidPathV2(_invalidDoubleSeparator);

    [Benchmark]
    public bool V1_InvalidConsecutiveSlash() => PathValidator.IsValidPathV1(_invalidConsecutiveSlash);
    [Benchmark]
    public bool V2_InvalidConsecutiveSlash() => PathValidator.IsValidPathV2(_invalidConsecutiveSlash);

    [Benchmark]
    public bool V1_Empty() => PathValidator.IsValidPathV1(_emptyPath);
    [Benchmark]
    public bool V2_Empty() => PathValidator.IsValidPathV2(_emptyPath);

    [Benchmark]
    public bool V1_SingleSegment() => PathValidator.IsValidPathV1(_singleSegment);
    [Benchmark]
    public bool V2_SingleSegment() => PathValidator.IsValidPathV2(_singleSegment);

    [Benchmark]
    public bool V1_DeeplyNested() => PathValidator.IsValidPathV1(_deeplyNested);
    [Benchmark]
    public bool V2_DeeplyNested() => PathValidator.IsValidPathV2(_deeplyNested);
}

// Heavy stress test benchmark
[MemoryDiagnoser]
[SimpleJob(iterationCount: 100, warmupCount: 10)]
public class PathValidatorStressBenchmarks
{
    private List<string> _testPaths = null!;
    private const int PathCount = 10000;

    [GlobalSetup]
    public void Setup()
    {
        var random = new Random(42);
        _testPaths = new List<string>(PathCount);

        for (int i = 0; i < PathCount; i++)
        {
            _testPaths.Add(GenerateRandomPath(random));
        }
    }

    private string GenerateRandomPath(Random random)
    {
        int segmentCount = random.Next(1, 15);
        var segments = new List<string>();

        for (int i = 0; i < segmentCount; i++)
        {
            int segmentLength = random.Next(3, 20);
            var segment = new char[segmentLength];

            segment[0] = (char)('a' + random.Next(26));
            segment[^1] = (char)('a' + random.Next(26));

            for (int j = 1; j < segmentLength - 1; j++)
            {
                int charType = random.Next(4);
                segment[j] = charType switch
                {
                    0 => (char)('a' + random.Next(26)),
                    1 => (char)('0' + random.Next(10)),
                    2 => '-',
                    _ => '_'
                };
            }

            segments.Add(new string(segment));
        }

        return string.Join("/", segments);
    }

    [Benchmark(Baseline = true)]
    public int V1_StressTest()
    {
        int validCount = 0;
        foreach (var path in _testPaths)
        {
            if (PathValidator.IsValidPathV1(path))
                validCount++;
        }
        return validCount;
    }

    [Benchmark]
    public int V2_StressTest()
    {
        int validCount = 0;
        foreach (var path in _testPaths)
        {
            if (PathValidator.IsValidPathV2(path))
                validCount++;
        }
        return validCount;
    }
}

// Parallel benchmark for concurrent workloads
[MemoryDiagnoser]
[SimpleJob(iterationCount: 50)]
public class PathValidatorParallelBenchmarks
{
    private List<string> _testPaths = null!;
    private const int PathCount = 50000;

    [GlobalSetup]
    public void Setup()
    {
        var random = new Random(42);
        _testPaths = Enumerable.Range(0, PathCount)
            .Select(i => $"api/v{i % 10}/resource{i}/sub{i % 5}/item{i}")
            .ToList();
    }

    [Benchmark(Baseline = true)]
    public int V1_Parallel()
    {
        return _testPaths.AsParallel()
            .Count(path => PathValidator.IsValidPathV1(path));
    }

    [Benchmark]
    public int V2_Parallel()
    {
        return _testPaths.AsParallel()
            .Count(path => PathValidator.IsValidPathV2(path));
    }
}

internal class PathValidator
{
    public static bool IsValidPathV2(ReadOnlySpan<char> path)
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

    public static bool IsValidPathV1(ReadOnlySpan<char> requestPath)
    {
        if (requestPath.IsEmpty)
            return true;

        while (!requestPath.IsEmpty)
        {
            int separatorIndex = requestPath.IndexOf('/');

            ReadOnlySpan<char> currentSegment;

            if (separatorIndex == -1)
            {
                currentSegment = requestPath;
                requestPath = [];
            }
            else
            {
                currentSegment = requestPath[..separatorIndex];
                requestPath = requestPath[(separatorIndex + 1)..];
            }

            if (currentSegment.IsEmpty)
                return false;

            if (!IsValidSegment(currentSegment))
                return false;
        }

        return true;
    }

    private static bool IsValidSegment(ReadOnlySpan<char> segment)
    {
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