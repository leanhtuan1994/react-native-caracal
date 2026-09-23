import { filterPosts, getPostTags } from './filter-posts';
import { MOCK_POSTS } from './mock-posts';

const ids = (posts: { id: number }[]) => posts.map((post) => post.id);

describe('filterPosts', () => {
  it('returns every post without filters', () => {
    expect(filterPosts(MOCK_POSTS, {})).toHaveLength(12);
  });

  it('matches the query case-insensitively in title or body', () => {
    expect(ids(filterPosts(MOCK_POSTS, { query: 'MOTHER' }))).toEqual([1]);
  });

  it('ignores a blank query', () => {
    expect(filterPosts(MOCK_POSTS, { query: '   ' })).toHaveLength(12);
  });

  it('filters by tag', () => {
    expect(ids(filterPosts(MOCK_POSTS, { tag: 'history' }))).toEqual([
      1, 3, 6, 12,
    ]);
  });

  it('applies query and tag together', () => {
    expect(
      ids(filterPosts(MOCK_POSTS, { query: 'street', tag: 'french' }))
    ).toEqual([9]);
  });

  it('returns nothing when no post matches', () => {
    expect(filterPosts(MOCK_POSTS, { query: 'zzzqqq' })).toEqual([]);
  });

  it('lists unique tags in first-seen order', () => {
    expect(getPostTags(MOCK_POSTS).slice(0, 6)).toEqual([
      'history',
      'american',
      'crime',
      'french',
      'fiction',
      'english',
    ]);
  });
});
