import { render, screen } from '@testing-library/react';

describe('Example Test', () => {
  it('renders hello', () => {
    render(<div>Hello</div>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
