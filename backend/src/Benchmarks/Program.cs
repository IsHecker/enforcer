using System.Threading.Tasks;
using BenchmarkDotNet.Running;

namespace Benchmarks;

public class Program
{
    public static async Task Main(string[] args)
    {
        BenchmarkRunner.Run<MiddlewareBenchmark>();
    }
}