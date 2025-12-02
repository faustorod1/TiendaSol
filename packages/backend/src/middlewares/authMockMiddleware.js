export const authMockMiddleware = (req, _res, next) => {
    const testUserId = req.headers['x-test-user-id'];
    req.user = { id: testUserId };
    next();
}