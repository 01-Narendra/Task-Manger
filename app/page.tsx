"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Layout, Shield } from "lucide-react";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import timer from '../public/timer.gif'
import project from '../public/project.gif'
import secure from '../public/secure.gif'
import Image from "next/image";
import { useUserStore } from "@/store/userStore";
import { useGetTasks } from "@/hook/useTask";
import { useTaskStore } from "@/store/useTaskStore";

export default function Home() {

    const setUser = useUserStore((state) => state.setUser);
    useEffect(() => {
      const fetchSession = async () => {
        const session = await getSession();
        if (session) {
          setUser(session.user?.email || "No email found");
        }
      };
      fetchSession();
    }, []);

    const user = useUserStore((state) => state.user);


  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TaskMaster</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#features" className="text-muted-foreground hover:text-primary">Features</a>
            <a href="#pricing" className="text-muted-foreground hover:text-primary">Pricing</a>
            <a href="#about" className="text-muted-foreground hover:text-primary">About</a>
          </nav>
          <div className="flex space-x-4">
            <Button variant="ghost" asChild>
              { user === "" && <Link href="/sign-in">Login</Link> }
            </Button>
            <Button asChild>
              <Link href={`${user === "" ? '/sign-up' : '/dashboard'}`}>Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Manage Tasks with <span className="text-primary">Confidence</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stay organized, focused, and in control with our powerful task management system.
            Perfect for individuals and teams who want to achieve more.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" asChild>
              <Link href={`${user === "" ? '/sign-up' : '/dashboard'}`}>Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container ml-[7%] px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to stay productive
          </h2>
          <div className="grid md:grid-cols-3 ml-[12%] gap-5">
            <div className="p-6 bg-card rounded-lg shadow-sm">
              <Image src={timer} alt="time management" className="w-24 h-24 mb-2" />
              <h3 className="text-xl font-semibold mb-2">Time Management</h3>
              <p className="text-muted-foreground">
                Set due dates, track time spent, and never miss a deadline with our
                intuitive time management features.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-sm">
              <Image src={project} alt="project organization" className="w-24 h-24 mb-2" />
              <h3 className="text-xl font-semibold mb-2">Project Organization</h3>
              <p className="text-muted-foreground">
                Organize tasks into projects, set priorities, and track progress
                with our flexible project management tools.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-sm">
              <Image src={secure} alt="secure and reliable" className="w-24 h-24 mb-2" />
              <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-muted-foreground">
                Your data is safe with us. We use industry-standard encryption
                and regular backups to protect your information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to boost your productivity?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who have transformed their task management
            with TaskMaster.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href={`${user === "" ? '/sign-up' : '/dashboard'}`}>Get Started Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">TaskMaster</span>
              </div>
              <p className="text-muted-foreground">
                Making task management simple and effective for everyone.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-muted-foreground hover:text-primary">Features</a></li>
                <li><a href="#pricing" className="text-muted-foreground hover:text-primary">Pricing</a></li>
                <li><a href="#about" className="text-muted-foreground hover:text-primary">About</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Help Center</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
            <p>&copy; 2024 TaskMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}