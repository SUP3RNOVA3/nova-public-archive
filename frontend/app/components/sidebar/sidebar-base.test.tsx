import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
let root: Root;
let container: HTMLDivElement;
function render(node: ReactNode) {
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  const rerender = (next: ReactNode) => act(() => root.render(next));
  rerender(node);
  return { rerender, container };
}
const screen = {
  getByText: (text: string) => {
    const found = [...container.querySelectorAll('*')].find(el => el.textContent === text);
    if (!found) throw new Error(`Missing text: ${text}`);
    return found;
  },
  queryByText: (text: string) => [...container.querySelectorAll('*')].find(el => el.textContent === text) ?? null,
  getByRole: (_: string, { name }: { name: string }) => container.querySelector(`[aria-label="${name}"]`)!,
};
const fireEvent = { click: (el: Element) => act(() => el.dispatchEvent(new MouseEvent('click', { bubbles: true }))) };
import { SidebarBase } from './sidebar-base';

vi.mock('react-i18next', async () => {
  const { useState } = await import('react');
  return { useTranslation: () => {
    useState('en'); // Real useTranslation also retains hook state on both branches.
    return { t: (key: string) => key };
  } };
});
afterEach(() => { act(() => root?.unmount()); container?.remove(); });

describe('SidebarBase responsive hook stability', () => {
  it('survives desktop to mobile closed/open/secondary and back', () => {
    const close = vi.fn();
    const props = { header: <span>Header</span>, footer: <span>Footer</span>, children: <span>Content</span>, onMobileClose: close };
    const { rerender, container } = render(<SidebarBase {...props} isMobile={false} />);
    expect(screen.getByText('Content')).toBeTruthy();
    rerender(<SidebarBase {...props} isMobile mobileOpen={false} />);
    expect(container.innerHTML).toBe('');
    rerender(<SidebarBase {...props} isMobile mobileOpen />);
    expect(screen.getByText('Content')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'sidebar.close' }));
    expect(close).toHaveBeenCalledOnce();
    rerender(<SidebarBase {...props} isMobile mobileOpen secondaryPanel={<span>Secondary</span>} />);
    expect(screen.getByText('Secondary')).toBeTruthy();
    expect(screen.queryByText('Content')).toBeNull();
    rerender(<SidebarBase {...props} isMobile={false} secondaryPanel={<span>Secondary</span>} />);
    expect(screen.getByText('Content')).toBeTruthy();
    expect(screen.getByText('Secondary')).toBeTruthy();
  });
  it('survives an initial closed mobile mount followed by desktop', () => {
    const { rerender, container } = render(<SidebarBase isMobile mobileOpen={false}>Content</SidebarBase>);
    expect(container.innerHTML).toBe('');
    rerender(<SidebarBase isMobile={false}>Content</SidebarBase>);
    expect(screen.getByText('Content')).toBeTruthy();
  });
});
