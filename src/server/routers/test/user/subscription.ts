
// import {mockedAxios} from '../../../../test-utils/mocks/axios'
// import {prismaMock} from '../../../../test-utils/mocks/prisma'
// import { caller } from "../..";

// describe("User Subscription API Route", () => {
//   /**
//    * input validation email, name, token
//    * inserts user details in db
//    * returns user.id
//    */

  
//   it("should create new subscription for user", async () => {
//     // mock recaptcha axios call
//     mockedAxios.get.mockResolvedValue({
//       success: true,
//       score: 0.9,
//     });

//     // mock database call
//     prismaMock.user.create.mockResolvedValue({
//       id: "111",
//       contact: "123456789",
//       name: "testing",
//       email: "test@gmail.com",
//     });

//     const result = await caller.user.createSubscription({
//       name: "testing",
//       email: "test@gmail.com",
//       token: "fake-token",
//     });

//     expect(result).toBe("111");
//     expect(mockedAxios.get).toHaveBeenCalled();
//     expect(prismaMock.user.create).toHaveBeenCalledWith({
//       id: "111",
//       contact: "123456789",
//       name: "testing",
//       email: "test@gmail.com",
//     });
//   });
// });

