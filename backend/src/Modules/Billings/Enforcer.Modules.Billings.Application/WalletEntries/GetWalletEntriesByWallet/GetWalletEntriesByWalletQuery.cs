using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.Billings.Contracts;

namespace Enforcer.Modules.Billings.Application.WalletEntries.GetWalletEntriesByWallet;

public readonly record struct GetWalletEntriesByWalletQuery(Guid WalletId, Pagination Pagination)
    : IQuery<PagedResponse<WalletEntryResponse>>;