// Single source of truth for the JIB invoice shared by operator ZTEST-I and
// WIO ZTEST-DD. Both the operator table (OpSearch) and the WIO table
// (NonOpSearch) read number/amount from here, so an edit reflects on both sides.
export const SHARED_INVOICE = {
  number: "1360048234",
  amount: "55,000.00",
};
