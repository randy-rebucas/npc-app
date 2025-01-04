import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia",
});

export class StripeService {
  static async createStripeAccount() {
    const account = await stripe.accounts.create({
      type: "express",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });
    return account.id;
  }

  static async getStripeAccount(accountId: string) {
    const account = await stripe.accounts.retrieve(accountId);
    return account;
  }

  static async getStripeAccountStatus(accountId: string) {
    const account = await stripe.accounts.retrieve(accountId);
    return account;
  }

  static async getStripeAccountLink(accountId: string) {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/payment`,
      return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/payment`,
      type: "account_onboarding",
    });
    return accountLink;
  }

  static async getStripeAccountPayouts(accountId: string) {
    const payouts = await stripe.payouts.list({
      stripeAccount: accountId,
    });
    return payouts;
  }

  static async deleteStripeAccount(accountId: string) {
    await stripe.accounts.del(accountId);
  }

  static async getNextPayout(accountId: string) {
    const payouts = await stripe.payouts.list({
      stripeAccount: accountId,
    });
    return payouts;
  }

  static async getEarnings(accountId: string) {
    const earnings = await stripe.balance.retrieve({
      stripeAccount: accountId,
    });
    return earnings;
  }

  // Payment Methods
  static async createPaymentIntent(amount: number, accountId: string) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
      transfer_data: {
        destination: accountId,
      },
    });
    return paymentIntent;
  }

  static async confirmPaymentIntent(paymentIntentId: string) {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
    return paymentIntent;
  }

  // Transfer Methods
  static async createTransfer(amount: number, accountId: string) {
    const transfer = await stripe.transfers.create({
      amount,
      currency: 'usd',
      destination: accountId,
    });
    return transfer;
  }

  static async listTransfers(accountId: string) {
    const transfers = await stripe.transfers.list({
      destination: accountId,
    });
    return transfers;
  }

  // Refund Methods
  static async createRefund(paymentIntentId: string) {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });
    return refund;
  }

  // Balance Methods
  static async getAvailableBalance(accountId: string) {
    const balance = await stripe.balance.retrieve({
      stripeAccount: accountId,
    });
    return balance.available;
  }

  // Payout Methods
  static async createPayout(amount: number, accountId: string) {
    const payout = await stripe.payouts.create({
      amount,
      currency: 'usd',
    }, {
      stripeAccount: accountId,
    });
    return payout;
  }

  static async cancelPayout(payoutId: string, accountId: string) {
    const payout = await stripe.payouts.cancel(payoutId, {
      stripeAccount: accountId,
    });
    return payout;
  }

  // Customer Methods
  static async createCustomer(email: string) {
    const customer = await stripe.customers.create({
      email,
    });
    return customer;
  }

  static async attachPaymentMethod(customerId: string, paymentMethodId: string) {
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
    return paymentMethod;
  }

  // Webhook Handling
  static constructEventFromPayload(payload: string, signature: string, webhookSecret: string) {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }

  // Dispute Handling
  static async listDisputes(accountId: string) {
    const disputes = await stripe.disputes.list({
      stripeAccount: accountId,
    });
    return disputes;
  }

  static async updateDispute(disputeId: string, accountId: string, evidence: Stripe.DisputeUpdateParams) {
    const dispute = await stripe.disputes.update(disputeId, evidence, {
      stripeAccount: accountId,
    });
    return dispute;
  }

  static async closeDispute(disputeId: string, accountId: string) {
    const dispute = await stripe.disputes.close(disputeId, {
      stripeAccount: accountId,
    });
    return dispute;
  }

  // Subscription Methods
  static async createSubscription(customerId: string, priceId: string, accountId: string) {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      transfer_data: {
        destination: accountId,
      },
      application_fee_percent: 10, // Adjust fee percentage as needed
    });
    return subscription;
  }

  static async cancelSubscription(subscriptionId: string) {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return subscription;
  }

  static async updateSubscription(subscriptionId: string, updateParams: Stripe.SubscriptionUpdateParams) {
    const subscription = await stripe.subscriptions.update(subscriptionId, updateParams);
    return subscription;
  }

  // Product & Price Management
  static async createProduct(productData: Stripe.ProductCreateParams, accountId: string) {
    const product = await stripe.products.create(productData, {
      stripeAccount: accountId,
    });
    return product;
  }

  static async createPrice(priceData: Stripe.PriceCreateParams, accountId: string) {
    const price = await stripe.prices.create(priceData, {
      stripeAccount: accountId,
    });
    return price;
  }

  // Account Capabilities
  static async updateAccountCapabilities(
    accountId: string,
    capabilities: Stripe.AccountUpdateParams.Capabilities
  ) {
    const account = await stripe.accounts.update(accountId, {
      capabilities,
    });
    return account;
  }
}
