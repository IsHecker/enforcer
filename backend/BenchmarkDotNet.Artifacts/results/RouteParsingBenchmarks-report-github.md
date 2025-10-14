```

BenchmarkDotNet v0.15.4, Windows 10 (10.0.19045.6332/22H2/2022Update)
AMD Ryzen 5 2600 3.40GHz, 1 CPU, 12 logical and 6 physical cores
.NET SDK 9.0.302
  [Host]     : .NET 8.0.1 (8.0.1, 8.0.123.58001), X64 RyuJIT x86-64-v3
  DefaultJob : .NET 8.0.1 (8.0.1, 8.0.123.58001), X64 RyuJIT x86-64-v3


```
| Method        | route                | Mean        | Error      | StdDev     | Gen0   | Allocated |
|-------------- |--------------------- |------------:|-----------:|-----------:|-------:|----------:|
| **MineWhileV2**   | **api/users/{id}**       |    **67.34 ns** |   **0.875 ns** |   **0.776 ns** | **0.0401** |     **168 B** |
| MineForeachV2 | api/users/{id}       |    73.88 ns |   0.954 ns |   0.846 ns | 0.0401 |     168 B |
| MineV1        | api/users/{id}       |   138.57 ns |   1.385 ns |   1.296 ns | 0.0782 |     328 B |
| Other         | api/users/{id}       | 1,023.95 ns |   8.728 ns |   7.289 ns | 0.2708 |    1136 B |
| **MineWhileV2**   | **api/v(...)mId?} [65]** |   **181.84 ns** |   **0.602 ns** |   **0.470 ns** | **0.0880** |     **368 B** |
| MineForeachV2 | api/v(...)mId?} [65] |   174.21 ns |   2.999 ns |   2.505 ns | 0.0880 |     368 B |
| MineV1        | api/v(...)mId?} [65] |   307.59 ns |   3.475 ns |   2.902 ns | 0.2103 |     880 B |
| Other         | api/v(...)mId?} [65] | 3,150.27 ns |  39.187 ns |  36.656 ns | 0.5646 |    2368 B |
| **MineWhileV2**   | **api/(...)ram} [170]**  |   **499.59 ns** |   **4.302 ns** |   **3.593 ns** | **0.1945** |     **816 B** |
| MineForeachV2 | api/(...)ram} [170]  |   531.14 ns |  10.661 ns |  10.948 ns | 0.1945 |     816 B |
| MineV1        | api/(...)ram} [170]  |   812.56 ns |   3.893 ns |   3.451 ns | 0.6981 |    2920 B |
| Other         | api/(...)ram} [170]  | 8,624.89 ns | 158.085 ns | 205.555 ns | 1.5106 |    6376 B |
