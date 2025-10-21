using BenchmarkDotNet.Running;

namespace Benchmarks;

internal sealed class Program
{
    public static async Task Main(string[] args)
    {
        BenchmarkRunner.Run<PathValidatorBenchmarks>();
    }
}