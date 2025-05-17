---
title: "NoFlyList : How NoFlyList Got Cleared for Production"
slug: "noflylist-how-noflylist-got-cleared-for-production-3cgf"
pubDate: 2024-12-20T14:36:41.980Z
description: "As the maintainer of Acts-as-Taggable-On (AATO), I started seeing patterns of technical debt and..."

tags: ["rails", "tutorial"]
---

As the maintainer of [Acts-as-Taggable-On](https://rubygems.org/gems/acts-as-taggable-on) (AATO), I started seeing patterns of technical debt and maintenance challenges around 2018. While AATO served its purpose well, its legacy codebase began showing signs of strain, especially with modern Rails applications.

## The Birth of NoFlyList

[NoFlyList](https://rubygems.org/gems/no_fly_list) wasn't born in a weekend hackathon, it evolved over years of real-world testing across multiple production applications. 

The name comes from how the TSA tags passengers and bags for extra screening. 
Much like the TSA's tagging system, this gem manages and validates tags. 
And unless you're actually building TSA software, you won't have any naming conflicts in your codebase.


The initial concept emerged from  a protocol and platform for sustainable, traceable and resilience supply chains, where the constraints of AATO became evident and ultimately lead me to the development of a more robust, flexible solution.

Let's walk through a practical example of how NoFlyList handles one of these real-world scenarios.

```ruby
class Product < ApplicationRecord
  include NoFlyList::TaggableRecord
  
  has_tags :categories,
    polymorphic: true,           # Shared across models
    restrict_to_existing: true,  # Only allow predefined categories
    counter_cache: true         # Track usage statistics
end
```

This simple configuration represents years of learning about what teams actually need in production. Each option addresses specific pain points discovered in real applications:

- Polymorphic tags came from the platform needing to share categories across products and services.
- Tag restrictions emerged from a content management system requiring controlled vocabularies.
- Counter cache was added after seeing performance issues in high-traffic situations.

## Database-Specific Optimizations

One feature that took significant real-world testing was the database-specific query strategies. Different applications had different scaling challenges:

```ruby
# PostgreSQL-optimized query
Product.with_all_categories("electronics", "gaming")
       .with_any_features("wireless", "bluetooth")

# MySQL-specific optimizations, model is using another connection.
MySqlProduct.without_any_categories("discontinued", "clearance")
```

## Testing Infrastructure

The test helpers was build from actual testing patterns i use across multiple applications:

```ruby
class ProductTest < ActiveSupport::TestCase
  include NoFlyList::TestHelper
  
  test "product categorization" do
    assert_taggable_record Product, :categories
    assert_tagging_context Product, :categories, polymorphic: true
  end
end
```

## Next Steps

While NoFlyList is now ready for public use, i'm still extracting and refining features based on real-world usage patterns. Future releases will include:

- Additional query optimizations
- Enhanced migration tools
- More granular caching options

The gem is stable and production-tested, but i'm continuously identifying features that could benefit the broader Rails community.

[The repo](https://github.com/contriboss/no_fly_list)

[Part2](/blog/noflylist-choosing-between-polymorphic-and-model-specific-tags-4phh)