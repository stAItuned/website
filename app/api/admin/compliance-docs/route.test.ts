import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from './route';

const verifyAuthMock = vi.fn();
const isAdminMock = vi.fn();
const listComplianceDocsMock = vi.fn();
const getComplianceDocByIdMock = vi.fn();

vi.mock('@/lib/firebase/server-auth', () => ({
  verifyAuth: (...args: unknown[]) => verifyAuthMock(...args),
}));

vi.mock('@/lib/firebase/admin-emails', () => ({
  isAdmin: (...args: unknown[]) => isAdminMock(...args),
}));

vi.mock('@/lib/admin/compliance-docs', () => ({
  listComplianceDocs: (...args: unknown[]) => listComplianceDocsMock(...args),
  getComplianceDocById: (...args: unknown[]) => getComplianceDocByIdMock(...args),
}));

type RequestArg = Parameters<typeof GET>[0];

function makeRequest(url: string): Request {
  return new Request(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer test-token',
    },
  });
}

describe('GET /api/admin/compliance-docs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when user is not authenticated', async () => {
    verifyAuthMock.mockResolvedValue(null);

    const response = await GET(makeRequest('http://localhost/api/admin/compliance-docs') as unknown as RequestArg);
    expect(response.status).toBe(401);
  });

  it('returns 403 when authenticated user is not admin', async () => {
    verifyAuthMock.mockResolvedValue({ email: 'user@example.com' });
    isAdminMock.mockReturnValue(false);

    const response = await GET(makeRequest('http://localhost/api/admin/compliance-docs') as unknown as RequestArg);
    expect(response.status).toBe(403);
  });

  it('returns docs list for admin', async () => {
    verifyAuthMock.mockResolvedValue({ email: 'admin@example.com' });
    isAdminMock.mockReturnValue(true);
    listComplianceDocsMock.mockResolvedValue([
      {
        id: 'dpia-role-fit-audit',
        title: 'DPIA',
        description: 'screening',
        relativePath: 'docs/dpia-screening-role-fit-audit.md',
        updatedAt: '2026-03-22T00:00:00.000Z',
      },
    ]);

    const response = await GET(makeRequest('http://localhost/api/admin/compliance-docs') as unknown as RequestArg);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      docs: [
        {
          id: 'dpia-role-fit-audit',
          title: 'DPIA',
          description: 'screening',
          relativePath: 'docs/dpia-screening-role-fit-audit.md',
          updatedAt: '2026-03-22T00:00:00.000Z',
        },
      ],
    });
  });

  it('returns single doc details when doc query param is present', async () => {
    verifyAuthMock.mockResolvedValue({ email: 'admin@example.com' });
    isAdminMock.mockReturnValue(true);
    getComplianceDocByIdMock.mockResolvedValue({
      id: 'dpia-role-fit-audit',
      title: 'DPIA',
      description: 'screening',
      relativePath: 'docs/dpia-screening-role-fit-audit.md',
      updatedAt: '2026-03-22T00:00:00.000Z',
      content: '# DPIA',
    });

    const response = await GET(
      makeRequest('http://localhost/api/admin/compliance-docs?doc=dpia-role-fit-audit') as unknown as RequestArg,
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      doc: {
        id: 'dpia-role-fit-audit',
        title: 'DPIA',
        description: 'screening',
        relativePath: 'docs/dpia-screening-role-fit-audit.md',
        updatedAt: '2026-03-22T00:00:00.000Z',
        content: '# DPIA',
      },
    });
  });
});
