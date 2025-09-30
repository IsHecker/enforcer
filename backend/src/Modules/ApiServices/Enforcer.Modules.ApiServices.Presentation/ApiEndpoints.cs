namespace Enforcer.Modules.ApiServices.Presentation;

internal static class ApiEndpoints
{
    private const string ApiBase = "api";
    private const string ApiServicesBase = $"{ApiBase}/api-services";
    private const string EndpointsBase = $"{ApiBase}/endpoints";
    private const string PlansBase = $"{ApiBase}/plans";
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
        public const string Create = EndpointsBase;
        public const string Update = GetById;
        public const string Delete = GetById;

        public const string ListEndpointsForPlan = $"{Plans.GetById}/endpoints";
        public const string ListEndpointsForService = $"{ApiServices.GetById}/endpoints";
    }

    public static class Plans
    {
        public const string List = PlansBase;
        public const string ListPlansForService = $"{ApiServices.GetById}/plans";
        public const string GetById = $"{PlansBase}/{{planId:guid}}";
        public const string Create = PlansBase;
        public const string Update = GetById;
        public const string Delete = GetById;
    }

    public static class Subscriptions
    {
        public const string ListUserSubscriptions = SubscriptionsBase;
        public const string GetById = $"{SubscriptionsBase}/{{subscriptionId:guid}}";
        public const string Create = SubscriptionsBase;
        public const string Update = GetById;
        public const string Delete = GetById;

        public const string CancelSubscription = $"{GetById}/cancel";
        public const string ChangeSubscriptionPlan = $"{GetById}/plan";
        public const string IsUserSubscribedToService = $"{Users.GetById}/subscriptions/{{apiServiceId:guid}}";
        public const string ListServiceSubscribers = $"{ApiServices.GetById}/subscribers";
        public const string RenewSubscription = $"{GetById}/renew";
    }

    public static class Users
    {
        public const string GetById = $"{UsersBase}/{{userId:guid}}";
    }
}