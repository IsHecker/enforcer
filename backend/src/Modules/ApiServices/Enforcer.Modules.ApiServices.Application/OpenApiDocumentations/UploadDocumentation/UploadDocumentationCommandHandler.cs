using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Enforcer.Modules.ApiServices.Domain.OpenApiDocumentations;
using Microsoft.OpenApi.Readers;
using Microsoft.EntityFrameworkCore;
using Enforcer.Common.Application.Data;

namespace Enforcer.Modules.ApiServices.Application.OpenApiDocumentations.UploadDocumentation;

internal sealed class UploadDocumentationCommandHandler(
    IApiServiceRepository apiServiceRepository,
    IRepository<OpenApiDocumentation> documentationRepository)
    : ICommandHandler<UploadDocumentationCommand>
{
    public async Task<Result> Handle(UploadDocumentationCommand command, CancellationToken cancellationToken)
    {
        var reader = new OpenApiStringReader();
        reader.Read(command.Specification, out var diagnostic);

        if (diagnostic.Errors.Any())
        {
            var firstError = diagnostic.Errors.First();
            return OpenApiDocumentationErrors.InvalidDocumentation(
                $"{firstError.Message} (at {firstError.Pointer})");
        }

        var apiService = await apiServiceRepository.GetByIdAsync(command.ApiServiceId, cancellationToken);
        if (apiService is null)
        {
            return ApiServiceErrors.NotFound(command.ApiServiceId);
        }

        if (apiService.ApiDocId.HasValue)
        {
            var existingDoc = await documentationRepository.GetByIdAsync(apiService.ApiDocId.Value, cancellationToken);
            existingDoc?.UpdateDocumentation(command.Specification);

            return Result.Success;
        }

        var newDoc = OpenApiDocumentation.Create(apiService.Id, command.Specification);
        await documentationRepository.AddAsync(newDoc.Value, cancellationToken);
        apiService.UpdateApiDocId(newDoc.Value.Id);

        return Result.Success;
    }
}