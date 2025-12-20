using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.Billings.Contracts;

namespace Enforcer.Modules.Billings.Application.WalletEntries.ListWalletEntriesByWallet;

public readonly record struct ListWalletEntriesByWalletQuery(Guid WalletId, Pagination Pagination)
    : IQuery<PagedResponse<WalletEntryResponse>>;