import { prisma } from "../../database";

const Query = {
  async listBankAccount(obj: any, args: any, ctx: any) {
    /* istanbul ignore next */
    try {
      const accounts = await prisma.bankAccount.findMany({ where: { userId: ctx.user.id } });
      return accounts;
      /* istanbul ignore next */
    } catch (err: any) {
      /* istanbul ignore next */
      throw new Error(err);
    }
  },
};

export default Query;
