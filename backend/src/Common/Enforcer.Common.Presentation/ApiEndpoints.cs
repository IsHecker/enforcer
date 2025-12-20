namespace Enforcer.Common.Presentation;

public static class ApiEndpoints
{
    private const string ApiBase = "api";
    private const string ApiServicesBase = $"{ApiBase}/api-services";
    private const string PlansBase = $"{ApiBase}/plans";
    private const string EndpointsBase = $"{ApiBase}/endpoints";
    private const string SubscriptionsBase = $"{ApiBase}/subscriptions";
    private const string UsersBase = $"{ApiBase}/users";
    private const string ApiKeysBase = $"{ApiBase}/apikeys";

    private const string AnalyticsBase = $"{ApiBase}/analytics";

    private const string PaymentProcessingBase = $"{ApiBase}/payments";
    private const string PaymentMethodsBase = $"{ApiBase}/payment-methods";
    private const string WalletsBase = $"{ApiBase}/wallets";

    private const string PromotionalCodesBase = $"{ApiBase}/promo-codes";

    public static class ApiServices
    {
        public const string List = ApiServicesBase;
        public const string GetById = $"{ApiServicesBase}/{{apiServiceId:guid}}";
        public const string Create = ApiServicesBase;
        public const string Update = GetById;
        public const string Delete = GetById;

        public const string SetApiServiceStatus = $"{GetById}/status";
        public const string ListCreatorApiServices = $"{Users.GetById}/api-services";

        public const string GetStats = $"{GetById}/stats";

        public const string Rate = $"{GetById}/rate";
    }

    public static class Endpoints
    {
        public const string GetById = $"{EndpointsBase}/{{endpointId:guid}}";
        public const string Create = $"{ApiServices.GetById}/endpoints";
        public const string Update = GetById;
        public const string Delete = GetById;

        public const string ListEndpointsForPlan = $"{Plans.GetById}/endpoints";
        public const string ListEndpointsForService = $"{ApiServices.GetById}/endpoints";
    }

    public static class Plans
    {
        public const string ListPlansForService = $"{ApiServices.GetById}/plans";
        public const string Create = $"{ApiServices.GetById}/plans";

        public const string GetById = $"{PlansBase}/{{planId:guid}}";
        public const string Update = GetById;
        public const string Delete = GetById;

        public const string GetStats = $"{GetById}/stats";
    }

    public static class Subscriptions
    {
        public const string ListUserSubscriptions = SubscriptionsBase;
        public const string GetById = $"{SubscriptionsBase}/{{subscriptionId:guid}}";
        public const string Create = SubscriptionsBase;

        public const string CancelSubscription = $"{GetById}/cancel";
        public const string SwitchSubscriptionPlan = $"{GetById}/switch-plan";
        public const string RenewSubscription = $"{GetById}/renew";
        public const string IsUserSubscribedToService = $"{ApiServices.GetById}/subscriptions/me";

        public const string ListServiceSubscribers = $"{ApiServices.GetById}/subscribers";

        public const string GetStats = $"{GetById}/stats";
    }

    public static class ApiUsages
    {
        public const string GetSubscriptionApiUsage = $"{Subscriptions.GetById}/api-usage";
    }

    public static class Users
    {
        public const string GetById = $"{UsersBase}/{{userId:guid}}";
    }

    public static class ApiKeys
    {
        public const string GetById = $"{ApiKeysBase}/{{apiKey}}";
        public const string Ban = $"{GetById}/ban";
        public const string Unban = $"{GetById}/ban";
        public const string ListBannedApiKeys = $"{ApiKeysBase}/banned";
    }

    public static class Analytics
    {
        public const string ListEndpointStats = $"{AnalyticsBase}/endpoint-stats";
    }

    public static class PaymentProcessing
    {
        public const string CreateCheckoutSession = $"{PaymentProcessingBase}/create-checkout-session";

        public const string StripeWebhook = $"{PaymentProcessingBase}/stripe/webhook";
        public const string StripeConnectWebhook = $"{PaymentProcessingBase}/stripe/connect-webhook";
    }

    public static class PaymentMethods
    {
        public const string ListByConsumer = PaymentMethodsBase;
        public const string GetById = $"{PaymentMethodsBase}/{{paymentMethodId:guid}}";

        public const string Create = PaymentMethodsBase;
        public const string Delete = GetById;

        public const string SetDefault = $"{GetById}/default";
    }

    public static class Wallets
    {
        public const string GetByUser = WalletsBase;
        public const string GetById = $"{WalletsBase}/{{walletId:guid}}";
        public const string Withdrawl = $"{WalletsBase}/withdraw";
        public const string CreateOnboardingSession = $"{WalletsBase}/onboarding-session";
    }

    public static class WalletEntries
    {
        public const string ListByWallet = $"{WalletsBase}/entries";
    }

    public static class Payouts
    {
        public const string ListByCreator = $"{WalletsBase}/payouts";
    }

    public static class PromotionalCodes
    {
        public const string ListByPlan = $"{PromotionalCodesBase}/{{planId:guid}}";

        public const string Create = PromotionalCodesBase;
    }
}