<!-- Utils -->

const { fetch, setData } = trpc.useUtils().admin.getSchedule;

<!-- Query -->

const { data: scheducledData } = trpc.admin.getSchedule.useQuery({
ScheduleDate: "",
});

<!-- Mutation -->

const { mutate: MutateApi } = trpc.subscribeNewsletter.useMutation({
onSuccess(data, variables, context) {},
onError(error, variables, context) {
if (error.data?.code === "TOO_MANY_REQUESTS") {
toast({
description: "You hvae been trying way too many times",
});
}
},
onMutate(variables) {},
onSettled(data, error, variables, context) {},
});
