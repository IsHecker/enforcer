using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.ApiServices.Events;

internal sealed class ApiServicePublishedEvent(Guid apiServiceId) : DomainEvent
{
    public Guid ApiServiceId { get; init; } = apiServiceId;
}