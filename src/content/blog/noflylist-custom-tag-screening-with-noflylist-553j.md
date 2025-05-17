---
title: "NoFlyList: Custom Tag Screening with NoFlyList"
slug: "noflylist-custom-tag-screening-with-noflylist-553j"
pubDate: 2024-12-20T14:47:13.310Z
description: "Tag parsing seems simple until you handle real user input.   Let's explore how NoFlyList's..."

tags: ["rails", "tutorial"]
---

Tag parsing seems simple until you handle real user input. 

Let's explore how NoFlyList's transformers handle messy tag data submitted.

## Basic Setup

```ruby
rails generate no_fly_list:transformer
```

Default transformer:
```ruby
module ApplicationTagTransformer
  module_function

  def parse_tags(tags)
    if tags.is_a?(Array)
      tags
    else
      tags.split(separator).map(&:strip).compact
    end
  end

  def recreate_string(tags)
    tags.join(separator)
  end

  def separator
    ','
  end
end
```

## Real-World Examples

### Hashtag Transformer

```ruby
module HashtagTransformer
  module_function

  def parse_tags(tags)
    return tags if tags.is_a?(Array)
    
    tags.scan(/#[\w-]+/).map { |tag| tag.delete('#') }
  end

  def recreate_string(tags)
    tags.map { |tag| "##{tag}" }.join(' ')
  end
end

class Post < ApplicationRecord
  include NoFlyList::TaggableRecord
  
  has_tags :hashtags, transformer: HashtagTransformer
end

post = Post.new(content: "Check out #rails #ruby #webdev")
post.hashtags_list = post.content  # Extracts: ["rails", "ruby", "webdev"]
```

### Multi-Language Transformer

```ruby
module MultiLangTransformer
  module_function

  def parse_tags(tags)
    return tags if tags.is_a?(Array)
    
    tags.split('|').map do |tag_pair|
      lang, tag = tag_pair.split(':').map(&:strip)
      "#{lang}:#{tag}"
    end
  end

  def recreate_string(tags)
    tags.join(' | ')
  end
end

class Article < ApplicationRecord
  has_tags :keywords, transformer: MultiLangTransformer
end

article.keywords_list = "en:ruby | es:rubí | fr:rubis"
```

### Hierarchical Tag Transformer

```ruby
module CategoryTransformer
  module_function

  def parse_tags(tags)
    return tags if tags.is_a?(Array)
    
    tags.split('>').map(&:strip)
  end

  def recreate_string(tags)
    tags.join(' > ')
  end
end

class Product < ApplicationRecord
  has_tags :categories, transformer: CategoryTransformer
end

product.categories_list = "Electronics > Computers > Laptops"
```

## Custom Normalization

```ruby
module NormalizedTransformer
  module_function

  def parse_tags(tags)
    tags = tags.split(',') unless tags.is_a?(Array)
    
    tags.map do |tag|
      tag.strip
         .downcase
         .gsub(/[^a-z0-9\s-]/, '')  # Remove special chars
         .gsub(/\s+/, '-')          # Spaces to hyphens
    end.uniq.compact
  end

  def recreate_string(tags)
    tags.join(', ')
  end
end

class Photo < ApplicationRecord
  has_tags :labels, transformer: NormalizedTransformer
end

photo.labels_list = "Nature Photos, WILDLIFE shots, Outdoor-Photography"
# Transforms to: ["nature-photos", "wildlife-shots", "outdoor-photography"]
```

## Context-Specific Transformers

Mix transformers based on tag context:

```ruby
class Article < ApplicationRecord
  include NoFlyList::TaggableRecord
  
  has_tags :categories, transformer: CategoryTransformer
  has_tags :hashtags, transformer: HashtagTransformer
  has_tags :keywords, transformer: MultiLangTransformer
end
```

## Testing Transformers

```ruby
class TransformerTest < ActiveSupport::TestCase
  test "hashtag parsing" do
    input = "#ruby #rails doing #testing"
    expected = ["ruby", "rails", "testing"]
    assert_equal expected, HashtagTransformer.parse_tags(input)
  end
  
  test "hierarchical parsing" do
    input = "Tech > Software > Tools"
    expected = ["Tech", "Software", "Tools"]
    assert_equal expected, CategoryTransformer.parse_tags(input)
  end
end
```

Remember: Transformers are your first line of defense against messy tag data. Like TSA agents, they ensure only properly formatted tags make it through to your system.

[Part4](/blog/noflylist-how-noflylist-optimizes-tag-queries-3hbd)