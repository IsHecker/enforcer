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

    private const string PaymentsBase = $"{ApiBase}/payments";

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
        public const string ChangeSubscriptionPlan = $"{GetById}/change-plan";
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

    public static class Payments
    {
        public const string CreateSetupSession = $"{PaymentsBase}/create-setup-session";
        public const string CreateCheckoutSession = $"{PaymentsBase}/create-checkout-session";

        public const string StripeWebhook = $"{PaymentsBase}/stripe/webhook";
    }
}