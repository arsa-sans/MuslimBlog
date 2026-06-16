<?php

use App\Models\User;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('allows anyone to list posts', function () {
    $post = Post::factory()->create();

    $response = $this->getJson('/api/post');

    $response->assertStatus(200)
             ->assertJsonFragment(['title' => $post->title]);
});

it('allows anyone to view a specific post', function () {
    $post = Post::factory()->create();

    $response = $this->getJson("/api/post/{$post->id}");

    $response->assertStatus(200)
             ->assertJsonPath('title', $post->title);
});

it('denies guests from creating a post', function () {
    $response = $this->postJson('/api/post', [
        'title' => 'Test Post',
        'body' => 'Test Body',
    ]);

    $response->assertStatus(401);
});

it('allows authenticated users to create a post', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user, 'sanctum')->postJson('/api/post', [
        'title' => 'My First Post',
        'body' => 'Post Content Body',
    ]);

    $response->assertStatus(201)
             ->assertJsonPath('title', 'My First Post')
             ->assertJsonPath('user_id', $user->id);
});

it('allows the owner to update their post', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user, 'sanctum')->putJson("/api/post/{$post->id}", [
        'title' => 'Updated Title',
        'body' => 'Updated Body',
    ]);

    $response->assertStatus(200)
             ->assertJsonPath('title', 'Updated Title')
             ->assertJsonPath('body', 'Updated Body');
});

it('denies other users from updating a post', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $post = Post::factory()->create(['user_id' => $owner->id]);

    $response = $this->actingAs($otherUser, 'sanctum')->putJson("/api/post/{$post->id}", [
        'title' => 'Updated Title',
        'body' => 'Updated Body',
    ]);

    $response->assertStatus(403);
});

it('allows the owner to delete their post', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user, 'sanctum')->deleteJson("/api/post/{$post->id}");

    $response->assertStatus(200)
             ->assertJsonPath('message', 'Post deleted successfully');

    $this->assertDatabaseMissing('posts', ['id' => $post->id]);
});

it('denies other users from deleting a post', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $post = Post::factory()->create(['user_id' => $owner->id]);

    $response = $this->actingAs($otherUser, 'sanctum')->deleteJson("/api/post/{$post->id}");

    $response->assertStatus(403);
    $this->assertDatabaseHas('posts', ['id' => $post->id]);
});

it('handles api registration correctly', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertStatus(201)
             ->assertJsonStructure(['message', 'user', 'token']);
});

it('handles api login correctly', function () {
    $user = User::factory()->create([
        'password' => Hash::make('password123'),
    ]);

    $response = $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'password123',
    ]);

    $response->assertStatus(200)
             ->assertJsonStructure(['message', 'user', 'token']);
});
