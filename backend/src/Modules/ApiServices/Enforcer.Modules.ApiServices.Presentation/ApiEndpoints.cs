namespace Enforcer.Modules.ApiServices.Presentation;

internal static class ApiEndpoints
{
    private const string ApiBase = "api";
    private const string ApiServicesBase = $"{ApiBase}/api-services";
    private const string PlansBase = $"{ApiBase}/plans";
    private const string EndpointsBase = $"{ApiBase}/endpoints";
    private const string SubscriptionsBase = $"{ApiBase}/subscriptions";
    private const string UsersBase = $"{ApiBase}/users";

    public static class ApiServices
    {
        public const string List = ApiServicesBase;
        public const string GetById = $"{ApiServicesBase}/{{apiServiceId:guid}}";
        public const string Create = ApiServicesBase;
        public const string Update = GetById;
        public const string Delete = GetById;

        public const string SetApiServiceStatus = $"{GetById}/status";
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
    }

    public static class Users
    {
        public const string GetById = $"{UsersBase}/{{userId:guid}}";
    }
}