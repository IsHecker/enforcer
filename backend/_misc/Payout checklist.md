## Payout Feature Checklist

### Core Entities ✅
- [x] Wallet entity
- [x] WalletEntry entity
- [x] Payout entity
- [x] RevenueShareAgreement entity

### Wallet Operations
- [x] Wallet repository (CRUD)
- [x] WalletEntry repository
- [ ] Create wallet on user registration
- [x] Get wallet by userId
- [x] Get wallet transaction history

### Revenue Tracking (Optional)
- [ ] Create RevenueShareAgreement for providers
- [ ] Hook into `payment_intent.succeeded` webhook → Add earnings to wallet
- [ ] Calculate platform fee vs provider share correctly
- [ ] Record WalletEntry for each earning

### Payout Processing
- [x] Payout repository (CRUD)
- [x] `ProcessPayoutCycleJob` background job
  - [x] Find providers with balance ≥ minimum
  - [x] Create Payout records
  - [x] Process Stripe transfers
  - [x] Handle failures
- [x] Stripe Connect integration
  - [ ] Provider onboarding (connect Stripe account)
  - [x] Create transfers API
  - [ ] Store `StripeConnectAccountId` in wallet

### Withdrawal (On-Demand)
- [x] Withdraw endpoint: `POST /api/wallet/withdraw`
- [x] Validate minimum amount
- [x] Validate payout method configured
- [x] Create Payout record
- [x] Process Stripe transfer
- [x] Update wallet balance

### Provider Dashboard/API
- [ ] Get wallet balance: `GET /api/wallet`
- [ ] Get transaction history: `GET /api/wallet/transactions`
- [ ] Get payout history: `GET /api/wallet/payouts`
- [ ] Withdraw money: `POST /api/wallet/withdraw`
- [ ] Connect Stripe account: `POST /api/wallet/connect-payout-method`

### Admin Features
- [ ] View all provider balances
- [ ] View pending payouts
- [ ] Manual payout trigger
- [ ] Hold/freeze provider payouts
- [ ] Payout reports (total paid, pending, failed)

### Configuration
- [x] `PayoutOptions` (minimum withdrawal, platform fee %)
- [x] Quartz job schedule configuration
- [x] Stripe Connect configuration

### Edge Cases (Optional)
- [ ] Handle provider with negative balance (owes platform)
  **What to handle:**
  > - [ ] Don't allow withdrawal when balance is negative
  > - [ ] Deduct from future earnings until debt is paid
  > - [ ] Show "You owe platform $80" in dashboard
  > - [ ] Maybe suspend provider until debt cleared

- [ ] Handle disputed payments (hold payout)
  What happens:
  * Bank reverses the $30
  * You lose the money
  * But provider already has $21 in balance

  **What to handle:**
  > - [ ] When dispute opened → HOLD provider's payout
  > - [ ] Freeze that $21 until dispute resolved
  > - [ ] If you win dispute → release hold
  > - [ ] If you lose dispute → deduct $21 from balance

- [ ] Handle provider account suspension (freeze payouts)
  **What to handle:**

  > - [ ] Provider can't withdraw money
  > - [ ] Automatic payouts are blocked

  **Balance stays frozen until:**
  > - [ ] Investigation complete
  > - [ ] Provider appeals successfully
  > - [ ] Account reinstated

- [ ] Handle multiple revenue share agreements (different rates per API)