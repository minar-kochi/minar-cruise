// import { prismaMock } from "@/test-utils/prisma/singleton";
// import { auth } from "@/auth/auth";
// import { caller } from "@/server/trpcCaller";

describe("Admin Booking API route", () => {

    test("",()=>{
        
    })
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   test("It should be able to delete booking from authenticated user", () => {
//     // const ctx = await createContextInner({});
//     // const caller = createCaller(ctx);
//     // const input: inferProcedureInput<AppRouter['post']['add']> = {
//     //   text: 'hello test',
//     //   title: 'hello test',
//     // };
//     // const post = await caller.post.add(input);
//     // const byId = await caller.post.byId({ id: post.id });

//     (auth as jest.Mock).mockResolvedValue({
//       user: {
//         id: "admin-user-id",
//         role: "admin",
//       },
//     });

//     prismaMock.booking.count.mockResolvedValue(1);

//     const res = caller.admin.booking.deleteBooking({ bookingId: "2" });
//     expect(res).toBeValid();
//     expect(prismaMock.booking.count).toHaveBeenCalledWith({
//       bookingId: "2",
//     });
//   });
});
